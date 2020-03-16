
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
import { DatePickerAndroid } from "react-native";
import { take } from "src/Models/common/logicUtils";
import { Condition } from "@nozbe/watermelondb/QueryDescription";
import ActiveTransaction from "../common/Transaction";


function activeCondition() {
    return Conditions.active();
}

export class RecurQuery extends ModelQuery<Recur, IRecur> {
    constructor() {
        super(RecurSchema.table);
    }

    queryActive = () => {
        return this.store().query(
            ...activeCondition()
        );
    }

    active = async () => {
        return (await this.queryActive().fetch()) as Recur[];
    }

    queryUnprocessed = () => {
        return this.store().query(
            ...[...Conditions.lastRefreshedOnOrBefore(new MyDate().subtract(1, "days").toDate()),
                ...activeCondition(),
            ]
        );
    }

    unprocessed = async () => {
        return (await this.queryUnprocessed().fetch()) as Recur[];
    }

    queryDailyUnprocessed = () => {
        return this.store().query(
            ...[...Conditions.lastRefreshedOnOrBefore(new MyDate().subtract(1, "days").toDate()),
                ...activeCondition(),
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
                ...activeCondition(),
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
                ...activeCondition(),
                Q.where(RecurSchema.name.TYPE, "monthly"),
                ]
        );
    }

    monthlyUnprocessed = async () => {
        return (await this.queryMonthlyUnprocessed().fetch()) as Recur[];
    }

    queries = () => {
        return [] as Condition[];
    }

    default = () => {
        const def: IRecur = {
            type: "daily",
            date: new Date(), 
            // are these necessary? It would be simpler to just assume that they recur at the same time.
            time: new Date(),
            weekDay: "sunday",
            monthDay: 1,
            active: true,
            lastRefreshed: new Date() // no need to calculate it if it was just created...
        }

        return def;
    }
}
export default RecurQuery;


export class RecurLogic {
    valid: boolean;
    id: string;
    constructor(id: string) {
        this.valid = true;
        this.id = id;
    }

    static createDataForGoal =  (repeats: "daily" | "weekly" | "monthly") => {
        switch(repeats) {
            case "daily": {
                return {
                    lastRefreshed: new Date(),
                    active: true,
                    type: "daily",
                } as const;
            } break;
            case "weekly": {
                return {
                    lastRefreshed: new Date(),
                    active: true,
                    type: "weekly",
                } as const;
            } break;
            default: {
                return {
                    lastRefreshed: new Date(),
                    active: true,
                    type: "monthly",
                } as const;
            }
        }
    }

    static processRecurrences = async () => {
        await RecurLogic.processSomeRecurrences();
    }

    static processSomeRecurrences = async (n?: number) => {
        const recurs : Recur[] = await new RecurQuery().unprocessed();
        await RecurLogic.process(recurs, n);
    }

    static processDailyRecurrences = async () => {
        await RecurLogic.processSomeDailyRecurrences();
    }

    static processSomeDailyRecurrences = async (n?: number) => {
        const recurs: Recur[] = await new RecurQuery().dailyUnprocessed();
        await RecurLogic.process(recurs, n);
    }

    
    private static process = async(arr: Recur[], n?: number) => {
        take(arr, n? n : arr.length).forEach((recur) => {
            void new RecurLogic(recur.id).generateNext();
        })
    }

    static processWeeklyRecurrences = async () => {
        await RecurLogic.processSomeWeeklyRecurrences();
    }

    static processSomeWeeklyRecurrences = async (n?: number) => {
        const recurs: Recur[] = await new RecurQuery().weeklyUnprocessed();
        await RecurLogic.process(recurs, n);
    }

    static processMonthlyRecurrences = async () => {
        await RecurLogic.processSomeMonthlyRecurrences();
    }

    static processSomeMonthlyRecurrences = async (n?: number) => {
        const recurs: Recur[] = await new RecurQuery().monthlyUnprocessed();
        await RecurLogic.process(recurs, n);
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
                    case "daily": {
                        void this._generateNext(latestGoal, latestGoal.startDate, "days");
                    } break;
                    case "weekly": {
                        void this._generateNext(latestGoal, latestGoal.startDate, "weeks");
                    } break;
                    case "monthly": {
                        void this._generateNext(latestGoal, latestGoal.startDate, "months");
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

    _generateNext = async (goal: Goal, d: Date, unit: "days" | "weeks" | "months") => {
        // We take the latest goal's start date. If we are in the day after the latest goal's start date/time,
        // then we add the goal again. If we are AFTER the day after the latest goal's start date/time,
        // then we add the goal until we have reached the current start date/time.
        let start = d;
        let goals: Promise<IGoal>[] = [];
        while(new MyDate().isInOrAfterNextCycleAfterDate(start, unit)) {
            const next = new MyDate(start).add(1, unit);
            const clone = GoalLogic.cloneRelativeTo(d, next.toDate(), goal)
            const promisify = new Promise<IGoal>((resolve) => {
                resolve(clone);
            })
            goals.push(promisify);
            start = next.toDate();
        }

        let fullGoals = await Promise.all(goals)
        void new GoalQuery().createMultiple(fullGoals);
    }

    enable = async () => {
        const recur = await new RecurQuery().get(this.id);
        if(recur) {
            const tx = await ActiveTransaction.new();
            tx.addUpdate(new RecurQuery(), recur, {
                active: true,
            })
            await tx.commitAndReset();
        }
    }

    disable = async () => {
        const recur = await new RecurQuery().get(this.id);
        if(recur) {
            const tx = await ActiveTransaction.new();
            tx.addUpdate(new RecurQuery(), recur, {
                active: false
            })
            await tx.commitAndReset();
        }
    }

    delete = async () => {
        // Luckily, deleting a recurrence doesn't really affect the underlying goals.
        const recur = await new RecurQuery().get(this.id);
        if(recur) {
            const tx = await ActiveTransaction.new();
            tx.addDelete(new RecurQuery(), recur)
            await tx.commitAndReset();
        }
    }
}

export {
    Recur,
    IRecur,
}