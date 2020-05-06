
import MyDate from "src/common/Date";
import { take } from "src/Models/common/logicUtils";
import ActiveTransaction, { InactiveTransaction } from "../common/Transaction";
import TaskQuery, { Task, TaskLogic, ITask } from "../Task/TaskQuery";


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
        const tasks : Task[] = await new TaskQuery().unprocessed();
        await RecurLogic.process(tasks, n);
    }

    private static process = async(arr: Task[], n?: number) => {
        take(arr, n? n : arr.length).forEach((task) => {
            void new RecurLogic(task.id).generateNext();
        })
    }

    /**
     * This function is responsible for generating the next tasks in the sequence.
     * Because mobile apps are and function on devices that may turn off, the function
     * will just regenerate the most recent two tasks in the sequence (to avoid overloading 
     * the returning user with past tasks)
     */
    generateNext = async (timeUntilNext?: number) => {
        const task = await new TaskQuery().get(this.id);
        if(task) {
            const tx = await ActiveTransaction.new();

            let update = {
                lastRefresh: MyDate.Now().toDate(),
                nextRepeatCalculated: false,
            };
            switch(task.repeat) {
                case "daily": {
                    const {calculated, consume} = await this._generateNext(task, "days");
                    tx.consume(consume);
                    update.nextRepeatCalculated = calculated;
                } break;
                case "weekly": {
                    const {calculated, consume} = await this._generateNext(task, "weeks");
                    tx.consume(consume);
                    update.nextRepeatCalculated = calculated;
                } break;
                case "monthly": {
                    const {calculated, consume} = await this._generateNext(task, "months");
                    tx.consume(consume);
                    update.nextRepeatCalculated = calculated;
                } break;
                default: {
                    //do nothing otherwise
                }
            } 

            tx.addUpdate(new TaskQuery(), task, update)

            tx.commitAndReset();
        }
    }

    _generateNext = async (latestTask: Task, unit: "days" | "weeks" | "months") => {
        const tx = new InactiveTransaction();
        let start = new MyDate(latestTask.startDate);

        // All we need to do is generate for the current and previous cycles, and that's it.
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
            default: {

            }
        }

        // Unlike habits, we'll only regenerate once. If your phone is dead the entire day, then we may as well
        // say that you never had to do the task for that day.
        if(regenerate) {
            tx.consume(await TaskLogic.cloneWithStart(MyDate.Now().toDate(), latestTask));
        }

        return { calculated: regenerate, consume: tx};
    }
}
