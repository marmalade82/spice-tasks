
import ModelQuery from "src/Models/base/Query";
import {
    Global, IGlobal,
} from "src/Models/Global/Global";
import { GlobalSchema } from "src/Models/Global/GlobalSchema";
import { Q, Database, Model } from "@nozbe/watermelondb";
import { Conditions, findAllChildrenIn } from "src/Models/common/queryUtils"
import DB from "src/Models/Database";
import MyDate from "src/common/Date";
import { Observable, interval, timer } from "rxjs";

const name = GlobalSchema.name

export default class GlobalQuery extends ModelQuery<Global, IGlobal> {

    constructor() {
        super(GlobalSchema.table);
    }

    queries = () => {
        return [];
    }

    default = () => {
        return {
            current: new Date(),
            count: 0,
        }
    }

    currentTime = async () => { 
        const times = await this.all()
        if(times.length > 0) {
            return times[0];
        } else {
            return null;
        }
    }
}

export class GlobalLogic {
    constructor() {

    }

    refreshCurrentTime = async () => {
        const time = await new GlobalQuery().currentTime()

        if(time) {
            await new GlobalQuery().update(time, {
                current: new Date(),
            });
        } else {
            await new GlobalQuery().create({
                current: new Date(),
            });
        }
    }
}

const DEFAULT_TIMER_LENGTH = 1;

/**
 * Timer that can be subscribed to. Runs every one minutes. Emits numbers in ascending order, starting from 0.
 * */
export const Global_Timer = interval(1000 * 60 * DEFAULT_TIMER_LENGTH);


export function observableWithRefreshTimer<T>( gen: () => Observable<T>, minutes?: number): Observable<T> {
    const Timer = interval(1000 * 60 * (minutes ? minutes : DEFAULT_TIMER_LENGTH));

    let obs: Observable<T> = new Observable((subscriber) => {
        let internalObs = gen();
        let internalSub = internalObs.subscribe((val) => {
            subscriber.next(val);
        })

        let timerSub = Timer.subscribe((_n) => {
            // Every time the timer emits, we generate a new observable to refresh any conditions that depend on time.
            internalSub.unsubscribe();
            internalObs = gen();
            internalSub = internalObs.subscribe((val) => {
                subscriber.next(val);
            })
        });

        // Cleans up the two internal subscriptions.
        return () => {
            internalSub.unsubscribe();
            timerSub.unsubscribe();
        }
    })

    return obs;
}