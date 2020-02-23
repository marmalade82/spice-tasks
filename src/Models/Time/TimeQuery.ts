
import ModelQuery from "src/Models/base/Query";
import {
    Time, ITime,
} from "src/Models/Time/Time";
import { TimeSchema } from "src/Models/Time/TimeSchema";
import { Q, Database, Model } from "@nozbe/watermelondb";
import { Conditions, findAllChildrenIn } from "src/Models/common/queryUtils"
import DB from "src/Models/Database";
import MyDate from "src/common/Date";
import { Observable, interval, timer } from "rxjs";

const name = TimeSchema.name

export default class TimeQuery extends ModelQuery<Time, ITime> {

    constructor() {
        super(TimeSchema.table);
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

export class TimeLogic {
    constructor() {

    }

    refreshCurrentTime = async () => {
        const time = await new TimeQuery().currentTime()

        if(time) {
            await new TimeQuery().update(time, {
                current: new Date(),
            });
        } else {
            await new TimeQuery().create({
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

        Timer.subscribe((_n) => {
            // Every time the timer emits, we generate a new observable to refresh any conditions that depend on time.
            internalSub.unsubscribe();
            internalObs = gen();
            internalSub = internalObs.subscribe((val) => {
                subscriber.next(val);
            })
        });
    })

    return obs;
}