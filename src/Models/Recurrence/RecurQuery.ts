
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
import ActiveTransaction, { InactiveTransaction } from "../common/Transaction";
import TaskQuery, { Task, TaskLogic, ITask } from "../Task/TaskQuery";


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
            ...[...Conditions.lastRefreshedOnOrBefore(MyDate.Now().subtract(1, "days").toDate()),
                ...activeCondition(),
            ]
        );
    }

    unprocessed = async () => {
        return (await this.queryUnprocessed().fetch()) as Recur[];
    }

    queryDailyUnprocessed = () => {
        return this.store().query(
            ...[...Conditions.lastRefreshedOnOrBefore(MyDate.Now().subtract(1, "days").toDate()),
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
            ...[...Conditions.lastRefreshedOnOrBefore(MyDate.Now().subtract(1, "days").toDate()),
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
            ...[...Conditions.lastRefreshedOnOrBefore(MyDate.Now().subtract(1, "days").toDate()),
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
            // are these necessary? It would be simpler to just assume that they recur at the same time.
            active: true,
            lastRefreshed: MyDate.Now().toDate() // no need to calculate it if it was just created...
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

    static createDataForTask =  (repeats: "daily" | "weekly" | "monthly") => {
        switch(repeats) {
            case "daily": {
                return {
                    lastRefreshed: MyDate.Now().toDate(),
                    active: true,
                    type: "daily",
                } as const;
            } break;
            case "weekly": {
                return {
                    lastRefreshed: MyDate.Now().toDate(),
                    active: true,
                    type: "weekly",
                } as const;
            } break;
            default: {
                return {
                    lastRefreshed: MyDate.Now().toDate(),
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
     * This function is responsible for generating the next tasks in the sequence.
     * Because mobile apps are and function on devices that may turn off, the function
     * will just regenerate the most recent two tasks in the sequence (to avoid overloading 
     * the returning user with past tasks)
     */
    generateNext = async (timeUntilNext?: number) => {
        const recur = await new RecurQuery().get(this.id);
        if(recur) {
            const tx = await ActiveTransaction.new();
            const oldTasks = await new TaskQuery().inRecurrence(this.id);
            const latestTask = oldTasks.sort((a, b) => {
                return b.startDate.valueOf() - a.startDate.valueOf();
            })[0];

            if(latestTask) {
                switch(recur.type) {
                    case "daily": {
                        const consume = await this._generateNext(latestTask, "days");
                        tx.consume(consume);
                    } break;
                    case "weekly": {
                        const consume = await this._generateNext(latestTask, "weeks");
                        tx.consume(consume);
                    } break;
                    case "monthly": {
                        const consume = await this._generateNext(latestTask, "months");
                        tx.consume(consume);
                    } break;
                    default: {
                        //do nothing otherwise
                    }
                } 
            }

            tx.addUpdate(new RecurQuery(), recur, {
                lastRefreshed: MyDate.Now().toDate()
            })

            tx.commitAndReset();
        }
    }

    _generateNext = async (latestTask: Task, unit: "days" | "weeks" | "months") => {
        const tx = new InactiveTransaction();
        let start = new MyDate(latestTask.startDate);

        //All we need to do is generate for the current and previous cycles, and that's it.
        // We calculate the current cycle from the date of the latest task.
        // We are not guaranteed that it is time to regenerate. We need to check first.
        let regenerate = false;
        switch (unit) {
            case "days": {
                // we don't need to do checks here, since it is a daily thing.
                regenerate = true;
            } break;
            case "weeks": {
                if(start.dayName() === MyDate.Now().dayName()) {
                    regenerate = true;
                }
            } break;
            case "months": {
                if((MyDate.Now().setDayOfMonth(start.dayOfMonth()).dayOfMonth() === MyDate.Now().dayOfMonth())) {
                    regenerate = true;
                }
            } break;
        }

        if(regenerate) {
            GoalLogic.cloneRelativeTo
            const tasksThisCycle = await new TaskQuery().inRecurrenceOn(this.id, MyDate.Now().toDate());
            if( tasksThisCycle.length === 0) {
                tx.addCreate(new TaskQuery(), TaskLogic.cloneWithStart(MyDate.Now().toDate(), latestTask));
            }

            const tasksLastCycle = await new TaskQuery().inRecurrenceOn(this.id, MyDate.Now().subtract(1, unit).toDate())
            if(tasksLastCycle.length === 0 ) {
                tx.addCreate(new TaskQuery(), TaskLogic.cloneWithStart(MyDate.Now().subtract(1, unit).toDate(), latestTask));
            }
        }

        return tx;
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