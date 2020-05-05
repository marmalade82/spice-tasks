if( typeof jest !== 'undefined' ) {
    jest.mock('src/Notification');
}
import ModelQuery from "src/Models/base/Query";
import {
    Global, IGlobal,
} from "src/Models/Global/Global";
import { GlobalSchema } from "src/Models/Global/GlobalSchema";
import MyDate from "src/common/Date";
import { Observable, interval, timer } from "rxjs";
import Notification from "src/Notification";
import TaskQuery, { ActiveTaskQuery, Task, TaskLogic } from "../Task/TaskQuery";
import GoalQuery, { Goal, GoalLogic, ActiveGoalQuery } from 'src/Models/Goal/GoalQuery';
import RecurQuery, { RecurLogic } from "src/Models/Recurrence/RecurQuery";
import { assignAll } from "src/common/types";
import Default from "src/Components/Styled/Styles";
import * as R from "ramda";

const name = GlobalSchema.name



export default class GlobalQuery extends ModelQuery<Global, IGlobal> {

    constructor() {
        super(GlobalSchema.table);
    }

    assign = (target: Global, source: Partial<IGlobal>) => {
        return assignAll([], target, source) as Global;
    }

    queries = () => {
        return [];
    }

    default = () => {
        return {
            current: MyDate.Now().toDate(),
            count: 0,
            lastNotifiedDate: MyDate.Now().toDate(),
            primaryColor: Default.PRIMARY_COLOR,
            primaryLightColor: Default.PRIMARY_COLOR_LIGHT,
            secondaryColor: Default.SECONDARY_COLOR,
            remindMe: false,
        }
    }

    current = async () => { 
        const all = await this.all()
        if(all.length > 0) {
            return all[0];
        } else {
            const global = await new GlobalQuery().create({})
            if(global) {
                return global;
            } else {
                throw new Error("failed to initialize global record in DB");
            }
        }
    }
}

export class GlobalLogic {
    constructor() {

    }

    runRefresh = async () => {
        await this.runRecordRefresh();
        await this.runDailyNotifications();
    }

    runReminders = async () => {
        console.log("running reminders")
        const tasks: Task[] = await new TaskQuery().inMinutes(30);
        const sortedAsc = R.sort((a, b) => {
            const first = new MyDate(a.startDate).setTime(new MyDate(a.startTime));
            const second = new MyDate(b.startDate).setTime(new MyDate(b.startTime));
            return first.toDate().valueOf() - second.toDate().valueOf();
        }, tasks)

        // Notify 5 minutes beforehand.
        console.log("found some tasks that need reminding: " + sortedAsc.length);
        if(sortedAsc.length > 0) {
            const date = new MyDate(sortedAsc[0].startDate)
                            .setTime(new MyDate(sortedAsc[0].startTime))
                            .subtract(2, "minutes")
                            .toDate()
            const others = `${ sortedAsc.length - 1 > 0 ? `, and ${sortedAsc.length - 1} others` : ""}`;

            console.log("scheduling notification");
            Notification.localNotificationSchedule({
                message: `Starting soon at ${new MyDate(sortedAsc[0].startTime).format("h:mm A")}: ${sortedAsc[0].title}${others}`,
               // date: new Date(Date.now() + 60 * 1000)
                date: date,
            })
            console.log("doen scheduling");
        }

        sortedAsc.forEach((task) => {
            void new TaskLogic(task.id).markReminded();
        })
    }

    runRecordRefresh = async () => {
        const count = 5;
        // process @count of the recurring goals for the day.
        // Keep this logic short so it doesn't take up too much resources.
        await RecurLogic.processSomeRecurrences(count);
        await GoalLogic.processSomeStreaks(count);
    }

    runDailyNotifications = async () => {
        let global = await new GlobalQuery().current();

        if( !new MyDate(global.lastNotifiedDate).isSomeTimeToday() ) {
            // Notify count of all due tasks
            const countDue = await new ActiveTaskQuery().queryDueToday().fetchCount();

            // Notify count of all overdue goals/tasks.
            const countOverdueGoals = await new ActiveGoalQuery().queryOverdue().fetchCount();
            const countOverdueTasks = await new ActiveTaskQuery().queryOverdue().fetchCount();

            Notification.localNotification({
                message: `Due today:  ${countDue.toString()}\nOverdue: ${(countOverdueGoals + countOverdueTasks).toString()}`,
            })

            await this.refreshNotificationDates();
        }
    }

    private refreshNotificationDates = async () => {
        const current = await new GlobalQuery().current();

        await new GlobalQuery().update(current, {
            lastNotifiedDate: MyDate.Now().toDate(),
        });
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