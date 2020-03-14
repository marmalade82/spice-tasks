import DB from "src/Models/Database"
import BatchedBridge from "react-native/Libraries/BatchedBridge/BatchedBridge"
import { Model as M, Model } from "@nozbe/watermelondb"
import ModelQuery, { IModelQuery } from "src/Models/base/Query";

import { Exact } from "src/common/types";





/**
 * Works with other DB logic to batch creates and updates together.
 */
export default class Transaction {
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

    /**
     * Merges other transaction into this transaction.
     * Other transaction is then reset.
     */
    consume = (other: Transaction) => {
        other.batch.forEach((line) => {
            this.batch.push(line);
        })

        other.reset();
    }

    /**
     * Finalizes a transaction and sends them all as one to the DB.
     */
    commit = async () => {
        await DB.get().action(async () => {
            await DB.get().batch(
                ...this.batch
            )
        })
    }

    commitAndReset = () => {
        void this.commit();
        this.reset();
    }

    /**
     * Removes everything from the gathered transaction
     */
    reset = () => {
        this.batch = [];
    }
}