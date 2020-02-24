import ModelQuery from "src/Models/base/Query";
import {
    Task, ITask,
} from "src/Models/Task/Task";
import TaskSchema from "src/Models/Task/TaskSchema";
import { Q, Database, Model } from "@nozbe/watermelondb";
import { Conditions, findAllChildrenIn } from "src/Models/common/queryUtils"
import DB from "src/Models/Database";
import MyDate from "src/common/Date";

export default class TaskQuery extends ModelQuery<Task, ITask> {
    constructor() {
        super(TaskSchema.table);
    }

    default = () => {
        return {
            title: "Default Task",
            instructions: "",
            startDate: new Date(),
            dueDate: new Date(),
            parentId: "",
            active: true,
            state: 'open',
            completedDate: MyDate.Zero().toDate(),
            createdAt: new MyDate().toDate(),
        } as const;
    }

    queryCreatedBetween = (left: Date, right: Date) => {
        return this.store().query(
            ...[ ...Conditions.createdAfter(left), ...Conditions.createdBefore(right)]
        )
    }

    createdBetween = async (left: Date, right: Date) => {
        return (await this.queryCreatedBetween(left, right).fetch()) as Task[];
    }

    queryCreatedBefore = (d: Date) => {
        return this.store().query(
            ...Conditions.createdBefore(d)
        );
    }

    createdBefore = async (d: Date) => {
        return (await this.queryCreatedBefore(d).fetch()) as Task[];
    }

    queryCreatedAfter = (d: Date) => {
        return this.store().query(
            ...Conditions.createdAfter(d)
        );
    }

    createdAfter = async (d:Date) => {
        return (await this.queryCreatedAfter(d).fetch()) as Task[];
    }

    queryCompletedToday = () => {
        return this.store().query(
            ...[...Conditions.completedToday(), ...Conditions.complete()]
        );
    }

    queryRemainingToday = () => {
        return this.store().query(
            Q.or(
                Q.and(
                    ...[...Conditions.active(), ...Conditions.dueToday(), ...Conditions.dueInFuture()]
                ),
                Q.and(
                    ...[...Conditions.active(), ...Conditions.started(), ...Conditions.notDue()]
                ),
            )
        )
    }

    queryHasParent = (parentId: string) => {
        return this.store().query(
            Q.where('parent_id', parentId),
        );
    }

    hasParent = async (parentId: string) => {
        return await this.queryHasParent(parentId).fetch() as Task[];
    }

    queryActive = () => {
        return this.store().query(
            Q.where('is_active', true)
        );
    }

    queryActiveHasParent = (parentId: string) => {
        return this.store().query(
            Q.where('is_active', true),
            Q.where('parent_id', parentId)
        );
    }

    queryActiveAndDueToday = () => {
        return this.store().query(
            ...[...Conditions.active(), ...Conditions.dueToday()]
        );
    }

    queryActiveAndDueSoonToday = () => {
        return this.store().query(
            ...[...Conditions.active(), ...Conditions.dueToday(), ...Conditions.dueInFuture()]
        );
    }

    queryActiveAndOverdue = () => {
        return this.store().query(
            ...[...Conditions.active(), ...Conditions.overdue()]
        );
    }

    /**
     * Query for tasks that are active, and due either today, or in the past (overdue).
     */
    queryActiveAndDue = () => {
        return this.store().query(
            Q.or(
                Q.and(
                    ...[...Conditions.active(), ...Conditions.overdue()]
                ),
                Q.and(
                    ...[...Conditions.active(), ...Conditions.dueToday()]
                )
            )
        )
    }

    queryActiveAndStartedButNotDue = () => {
        return this.store().query(
            ...[...Conditions.active(), ...Conditions.started(), ...Conditions.notDue()]
        )
    }

    queryActiveButNotStarted = () => {
        return this.store().query(
            ...[...Conditions.active(), ...Conditions.notStarted()]
        );
    }

    queryInactive = () => {
        return this.store().query(
            Q.where('is_active', false)
        );
    }

    queryFailed = () => {
        return this.store().query(...Conditions.failed());
    }

    failedTasks = async () => {
        return await this.queryFailed().fetch() as Task[];
    }

    queryInactiveHasParent = (parentId: string) => {
        return this.store().query(
            ...Conditions.inactiveChild(parentId)
        );
    }

    queryOpen = () => {
        return this.store().query(
            Q.where('state', 'open')
        );
    }

    queryCompletedHasParent = (parentId: string) => {
        return this.store().query(
            ...[...Conditions.inactiveChild(parentId), ...Conditions.complete()]
        )
    }

    completeTaskAndDescendants = async (opts: { id: string}) => {
        if(opts.id !== '') {
            try {
                const parent: Task = await this.store().find(opts.id) as Task;
                const allTasks: Task[] = await findAllChildrenIn(TaskSchema.table, parent.id, [parent]);
                const allTasksPrep = allTasks.map((task: Task) => {
                    return task.prepareUpdate((t: ITask) => {
                        t.active = false;
                        t.state = 'complete';
                        t.completedDate = new Date() // it was completed today.
                    });
                });

                await DB.get().action(async() => {
                    await DB.get().batch(...allTasksPrep);
                })
            } catch (e) {
                console.log(e);
                throw e;
            }
        }
    }

    queryActiveTasks = () => {
        const active = this.store().query(
            Q.where('is_active', true) 
        );

        return active;
    }

    activeTasks = async () => {
        return (await (this.queryActiveTasks()).fetch()) as Task[];
    }

    queryInactiveTasks = () => {
        const inactive = this.store().query(
            Q.where('is_active', false) 
        );

        return inactive;
    }

    inactiveTasks = async () => {
        return (await (this.queryInactiveTasks()).fetch()) as Task[];
    }

    queryCompletedTasks = () => {
        const complete = this.store().query(
            Q.where('state', 'complete')
        );

        return complete;
    }

    completedTasks = async() => {
        return (await this.queryCompletedTasks().fetch()) as Task[];
    }

    queryInStreakCycle = (start: Date, type: "daily" | "weekly" | "monthly") => {
        let unit: "days" | "weeks" | "months" = "days";
        switch(type) {
            case "daily": unit = "days"; break;
            case "weekly": unit = "weeks"; break;
            case "monthly": unit = "months"; break;
            default: { }
        }

        return this.store().query(
            ...[ ...Conditions.startsOnOrAfter(start),
                ...Conditions.startsBefore(new MyDate(start).add(1, unit).toDate()),
            ]
        )
    }

    inStreakCycle = async (start: Date, type: "daily" | "weekly" | "monthly") => {
        return await this.queryInStreakCycle(start, type).fetch() as Task[];
    }
}

export {
    TaskQuery,
    Task,
    ITask,
}

export class TaskLogic {
    id: string;
    constructor(id: string) {
        this.id = id;
    }

    cloneRelativeTo = async (oldDate, newDate : Date) => {
        const task = await new TaskQuery().get(this.id)

        if(task) {
            console.log("found task")
            const newTask : Omit<ITask, "createdAt" | "completedDate"> = {
                title: task.title,
                parentId: task.parentId,
                instructions: task.instructions,
                active: task.active,
                state: 'open',
                startDate: new MyDate(newDate).add( new MyDate(task.startDate).diff(oldDate, "minutes"), "minutes").toDate(),
                dueDate: new MyDate(newDate).add( new MyDate(task.dueDate).diff(oldDate, "minutes"), "minutes").toDate(),
            }
            return newTask;
        } else {
            console.log("no clone created")
            throw new Error()
        }
    }
}