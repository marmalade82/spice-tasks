
import ModelQuery from "src/Models/base/Query";
import {
    Recur, IRecur,
} from "src/Models/Recurrence/Recur";
import { RecurSchema } from "src/Models/Recurrence/RecurSchema";
import { Q, Database, Model } from "@nozbe/watermelondb";
import { Conditions, findAllChildrenIn } from "src/Models/common/queryUtils"
import DB from "src/Models/Database";
import MyDate from "src/common/Date";
import GoalQuery, { GoalLogic, IGoal, Goal } from "../Goal/GoalQuery";
import { tsAnyKeyword } from "@babel/types";


/**
 * If n < 1, returns @arr.
 * If n >= 1, returns the first n elements of the array, or the entire array if the 
 *  array has fewer than n elements
 * @param arr 
 * @param n 
 */
function take<T>(arr: T[], n: number): T[] {
    let num = Math.floor(n);
    if( num < 1) {
        return arr.concat([]);
    } else {
        let newArr: T[] = [];
        const newLength = Math.min(arr.length, num)
        for(let i = 0; i < newLength; i++) {
            newArr.push(arr[i]);
        }
        return newArr;
    }
}

export default class RecurQuery extends ModelQuery<Recur, IRecur> {
    constructor() {
        super(RecurSchema.table);
    }

    queryActive = () => {
        return this.store().query(
            ...Conditions.active()
        );
    }

    active = async () => {
        return (await this.queryActive().fetch()) as Recur[];
    }

    queryUnprocessed = () => {
        return this.store().query(
            ...[...Conditions.lastRefreshedOnOrBefore(new MyDate().subtract(1, "days").toDate()),
                ...Conditions.active(),
            ]
        );
    }

    unprocessed = async () => {
        return (await this.queryUnprocessed().fetch()) as Recur[];
    }

    queryDailyUnprocessed = () => {
        return this.store().query(
            ...[...Conditions.lastRefreshedOnOrBefore(new MyDate().subtract(1, "days").toDate()),
                ...Conditions.active(),
                Q.where(RecurSchema.name.TYPE, "daily"),
            ]
        );
    }

    dailyUnprocessed = async () => {
        return (await this.queryDailyUnprocessed().fetch()) as Recur[];
    }

    queryWeeklyUnprocessed = () => {
        return this.store().query(
            ...[...Conditions.lastRefreshedOnOrBefore(new MyDate().subtract(1, "days").toDate()),
                ...Conditions.active(),
                Q.where(RecurSchema.name.TYPE, "weekly"),
                ]
        );
    }

    weeklyUnprocessed = async () => {
        return (await this.queryWeeklyUnprocessed().fetch()) as Recur[];
    }

    queryMonthlyUnprocessed = () => {
        return this.store().query(
            ...[...Conditions.lastRefreshedOnOrBefore(new MyDate().subtract(1, "days").toDate()),
                ...Conditions.active(),
                Q.where(RecurSchema.name.TYPE, "monthly"),
                ]
        );
    }

    monthlyUnprocessed = async () => {
        return (await this.queryMonthlyUnprocessed().fetch()) as Recur[];
    }

    default = () => {
        return {
            type: "never",
            date: new Date(), 
            // are these necessary? It would be simpler to just assume that they recur at the same time.
            time: new Date(),
            weekDay: "sunday",
            monthDay: 1,
            active: true,
            lastRefreshed: new Date() // no need to calculate it if it was just created...
        } as const;
    }
}

export class RecurLogic {
    valid: boolean;
    id: string;
    constructor(id: string) {
        this.valid = true;
        this.id = id;
    }

    static processRecurrences = async () => {
        await RecurLogic.processSomeDailyRecurrences();
    }

    static processSomeRecurrences = async (n?: number) => {
        const recurs : Recur[] = await new RecurQuery().unprocessed();
        RecurLogic.process(recurs, n);
    }

    static processDailyRecurrences = async () => {
        await RecurLogic.processSomeDailyRecurrences();
    }

    static processSomeDailyRecurrences = async (n?: number) => {
        const recurs: Recur[] = await new RecurQuery().dailyUnprocessed();
        RecurLogic.process(recurs, n);
    }

    static process = async(arr: Recur[], n?: number) => {
        take(arr, n? n : arr.length).forEach((recur) => {
            void new RecurLogic(recur.id).generateNext();
        })
    }

    static processWeeklyRecurrences = async () => {
        await RecurLogic.processSomeWeeklyRecurrences();
    }

    static processSomeWeeklyRecurrences = async (n?: number) => {
        const recurs: Recur[] = await new RecurQuery().weeklyUnprocessed();
        RecurLogic.process(recurs, n);
    }

    static processMonthlyRecurrences = async () => {
        await RecurLogic.processSomeMonthlyRecurrences();
    }

    static processSomeMonthlyRecurrences = async (n?: number) => {
        const recurs: Recur[] = await new RecurQuery().monthlyUnprocessed();
        RecurLogic.process(recurs, n);
    }

    /**
     * This function is responsible for generating the next goals in the sequence.
     * Because mobile apps are and function on devices that may turn off, and this 
     * app will not communicate with the server, this function must restore all missing 
     * goals in the sequence, no matter how far behind the sequence has gotten due to,
     * say, the phone being turned off for a month.
     */
    generateNext = async (timeUntilNext?: number) => {
        const recur = await new RecurQuery().get(this.id);
        if(recur) {
            const oldGoals = await new GoalQuery().inRecurrence(this.id);
            const latestGoal = oldGoals.sort((a, b) => {
                return b.startDate.valueOf() - a.startDate.valueOf();
            })[0];

            if(latestGoal) {
                switch(recur.type) {
                    case "once": {
                        let startDate = new MyDate(recur.date);
                        let newGoal: IGoal | undefined = undefined;
                        let newStart: MyDate | undefined = undefined
                        if( startDate.inNext("minutes", timeUntilNext ? timeUntilNext : 50)) {
                            newStart = startDate;
                        }
                        if(newGoal && newStart) {
                            newGoal = await new GoalLogic(latestGoal.id).cloneRelativeTo(latestGoal.startDate, newStart.toDate());
                            void new GoalQuery().create(newGoal);
                        }
                    } break;
                    case "daily": {
                        void this._generateNext(latestGoal.id, latestGoal.startDate, "days");
                    } break;
                    case "weekly": {
                        void this._generateNext(latestGoal.id, latestGoal.startDate, "weeks");
                    } break;
                    case "monthly": {
                        void this._generateNext(latestGoal.id, latestGoal.startDate, "months");
                    } break;
                    default: {
                        //do nothing otherwise
                    }
                } 
            }

            // now we need to mark this recurrence as having been refreshed today.
            new RecurQuery().update(recur, {
                lastRefreshed: new Date()
            })
        }
    }

    _generateNext = async (id: string, d: Date, unit: "days" | "weeks" | "months") => {
        // We take the latest goal's start date. If we are in the day after the latest goal's start date/time,
        // then we add the goal again. If we are AFTER the day after the latest goal's start date/time,
        // then we add the goal until we have reached the current start date/time.
        let start = d;
        let goals: Promise<IGoal>[] = [];
        let logic = new GoalLogic(id);
        while(new MyDate().isInOrAfterNextCycleAfterDate(start, unit)) {
            const next = new MyDate(start).add(1, unit);
            const goal = logic.cloneRelativeTo(d, next.toDate());
            goals.push(goal);
            start = next.toDate();
        }

        let fullGoals = await Promise.all(goals)
        void new GoalQuery().createMultiple(fullGoals);
    }
}