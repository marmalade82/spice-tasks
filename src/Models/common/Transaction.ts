import DB from "src/Models/Database"
import BatchedBridge from "react-native/Libraries/BatchedBridge/BatchedBridge"
import { Model as M, Model } from "@nozbe/watermelondb"
import ModelQuery, { IModelQuery } from "src/Models/base/Query";

import { Exact } from "src/common/types";

var chance = require("chance");
var Chance = new chance();


/**
 * Inactive transaction. Used only to batch things together without having the ability to actually do them.
 */
export class InactiveTransaction {
    static new = () => {
        return new InactiveTransaction();
    }

    batch: M[] = [];

    addCreate = <Model extends M & IModel, IModel>(q: ModelQuery<Model, IModel>, schema: Exact<Partial<IModel>>) => {
        let added = q.prepareCreate(schema);
        this.batch.push(
            added
        );

        return added as Model;
    }

    addUpdate = <Model extends M & IModel, IModel>(q: ModelQuery<Model, IModel>, model: Model, schema: Exact<Partial<IModel>>) => {
        let updated = q.prepareUpdate(model, schema)
        this.batch.push(
            updated
        );

        return updated as Model;
    }

    addDelete = <Model extends M & IModel, IModel>(q: ModelQuery<Model, IModel>, model: Model) => {
        this.batch.push(
            q.prepareDelete(model),
        );
    }

    consume = (other: InactiveTransaction) => {
        other.batch.forEach((line) => {
            this.batch.push(line);
        })

        other.reset();
    }

    /**
     * Removes everything from the gathered transaction
     */
    reset = () => {
        this.batch = [];
    }
}


/**
 * Works with other DB logic to batch creates and updates together.
 */
export class ActiveTransaction {

    static new = async () => {
        // There can only be one active transaction at a time, so transactions should be kept short.
        const lock = await DBResourceLock.lock(ACTIVE_TRANSACTION);
        //lock.unlock(null);
        return new ActiveTransaction(lock);
    }

    /**
     * Frees the lock on the current active transaction so that transactions can continue in the background.
     * Hopefully this doesn't lead to too many errors.
    */
    static invalidate = () => {
        DBResourceLock.activeTxUnlock ? DBResourceLock.activeTxUnlock(null) : null;
    }

    batch: M[] = [];
    lock: Lock;
    constructor(lock: Lock) {
        this.lock = lock;
    }

    addCreate = <Model extends M & IModel, IModel>(q: ModelQuery<Model, IModel>, schema: Exact<Partial<IModel>>) => {
        let added = q.prepareCreate(schema);
        this.batch.push(
            added
        );

        return added as Model;
    }

    addUpdate = <Model extends M & IModel, IModel>(q: ModelQuery<Model, IModel>, model: Model, schema: Exact<Partial<IModel>>) => {
        let updated = q.prepareUpdate(model, schema)
        this.batch.push(
            updated
        );

        return updated as Model;
    }

    addDelete = <Model extends M & IModel, IModel>(q: ModelQuery<Model, IModel>, model: Model) => {
        this.batch.push(
            q.prepareDelete(model),
        );
    }

    /**
     * Merges other transaction into this transaction.
     * Other transaction is then reset.
     */
    consume = (other: InactiveTransaction) => {
        other.batch.forEach((line) => {
            this.batch.push(line);
        })

        other.reset();
    }

    /**
     * Finalizes a transaction and sends them all as one to the DB.
     */
    private commit = async () => {
        await DB.get().action(async () => {
            await DB.get().batch(
                ...this.batch
            )
        })

        //Once the transaction is over, we unlock and let the next transaction start.
        this.lock ? this.lock.unlock(null) : null;
    }

    commitAndReset = async () => {
        await this.commit();
        this.reset();
    }

    /**
     * Removes everything from the gathered transaction
     */
    reset = () => {
        this.batch = [];
    }

}
export default ActiveTransaction;

interface Resources {
    [key: string]: true | undefined | object;
}

type Lock = {
    result: object | null
    unlock: (payload: object | null) => void;
}

/**
 * Class for locking resources and resolving them with a result.
 */
export class DBResourceLock {
    static resources: Resources = {};
    static activeTxUnlock: undefined | ((payload: object | null) => void) = undefined;
    static lock = (name: string) => {
        return new Promise<Lock>((resolve, reject) => {
            let count = 0;
            const ms = 50;
            function acquireLock() {
                let resource = DBResourceLock.resources[name];
                if(resource === true) {
                    // the resource is currently locked, so we'll have to try again later.
                    setTimeout(() => {
                        if(count * ms > 5000) {
                            reject(); // we faied to acquire the lock in a reasonable amount of time.
                        } else {
                            count += 1;
                            acquireLock();
                        }
                    }, ms)
                } else {
                    // the resource is not currently locked, so we lock it.
                    DBResourceLock.resources[name] = true;
                    const unlock = (() => {
                        let locked = true;
                        return (payload: object | null) => {
                            if(locked) {
                                DBResourceLock.resources[name] = payload ? payload : undefined;
                            } else {
                                // unlocking an unlocked lock is a no-op.
                            }
                        }
                    })()

                    DBResourceLock.activeTxUnlock = unlock;
                    resolve({
                        result: resource ? resource : null,
                        unlock: unlock,
                    })
                }
            }
            acquireLock();
        }) 
    }
}

export const CURRENT_STREAK_CYCLE_ID: string = Chance.guid();
export const ACTIVE_TRANSACTION: string = Chance.guid();