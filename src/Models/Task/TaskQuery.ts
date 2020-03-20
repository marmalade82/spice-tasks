import ModelQuery from "src/Models/base/Query";
import {
    Task, ITask, TaskParentTypes,
} from "src/Models/Task/Task";
import TaskSchema from "src/Models/Task/TaskSchema";
import { Q, Database, Model } from "@nozbe/watermelondb";
import { Conditions, findAllChildrenIn } from "src/Models/common/queryUtils"
import DB from "src/Models/Database";
import MyDate from "src/common/Date";
import StreakCycleQuery, { ChildStreakCycleQuery } from "../Group/StreakCycleQuery";
import ActiveTransaction, { DBResourceLock, CURRENT_STREAK_CYCLE_ID, InactiveTransaction } from "../common/Transaction";
import GoalQuery from "../Goal/GoalQuery";
import StreakCycle from "../Group/StreakCycle";
import { Condition } from "@nozbe/watermelondb/QueryDescription";
import { dueDate } from "src/Components/Forms/common/utils";

export class TaskQuery extends ModelQuery<Task, ITask> {
    constructor() {
        super(TaskSchema.table);
    }

    queries = () => {
        return [] as Condition[];
    }

    default = () => {
        let def: ITask = {
            title: "Default Task",
            instructions: "",
            startDate: MyDate.Now().toDate(),
            dueDate: MyDate.Now().toDate(),
            parentId: "",
            active: true,
            state: 'open',
            completedDate: MyDate.Zero().toDate(),
            createdAt: new MyDate().toDate(),
            parentType: TaskParentTypes.TASK,
        };
        return def;
    }

    queryInSCycle = (cycleId: string) => {
        return this.query(
            Q.where(TaskSchema.name.PARENT, cycleId )
        )
    }

    queryCreatedBetween = (left: Date, right: Date) => {
        return this.query(
            ...[ ...Conditions.createdAfter(left), ...Conditions.createdBefore(right)]
        )
    }

    createdBetween = async (left: Date, right: Date) => {
        return (await this.queryCreatedBetween(left, right).fetch()) as Task[];
    }

    queryCreatedBefore = (d: Date) => {
        return this.query(
            ...Conditions.createdBefore(d)
        );
    }

    createdBefore = async (d: Date) => {
        return (await this.queryCreatedBefore(d).fetch()) as Task[];
    }

    queryCreatedAfter = (d: Date) => {
        return this.query(
            ...Conditions.createdAfter(d)
        );
    }

    createdAfter = async (d:Date) => {
        return (await this.queryCreatedAfter(d).fetch()) as Task[];
    }

    queryCompletedToday = () => {
        return this.query(
            ...[...Conditions.completedToday(), ...Conditions.complete()]
        );
    }

    queryInProgress = () => {
        return this.query(
            Q.and(
                ...[
                    ...Conditions.active(), ...Conditions.started()
                ],
                Q.or( Q.and(...Conditions.notDue()), Q.and(...Conditions.dueToday()))
            )
        )
    }

    queryInactive = () => {
        return this.query(
            ...Conditions.inactive()
        );
    }

    queryFailed = () => {
        return this.query(...Conditions.failed());
    }

    failedTasks = async () => {
        return await this.queryFailed().fetch() as Task[];
    }



    inactiveTasks = async () => {
        return (await (this.queryInactive()).fetch());
    }

    queryCompletedTasks = () => {
        const complete = this.query(
            ...Conditions.complete()
        );

        return complete;
    }

    completedTasks = async() => {
        return (await this.queryCompletedTasks().fetch()) as Task[];
    }

    queryInStreakCycle = (cycleId: string) => {
        return this.queryInSCycle(cycleId);
    }

    inStreakCycle = async (cycleId: string) => {
        return await this.queryInStreakCycle(cycleId).fetch() as Task[];
    }
}

export default TaskQuery;

export class ActiveTaskQuery extends ModelQuery<Task, ITask> {
    constructor() {
        super(TaskSchema.table);
    }
    default = () => {
        let def = new TaskQuery().default();
        def.active = true;
        return def;
    }

    queries = () => {
        return new TaskQuery().queries().concat([
            ...Conditions.active()
        ])
    }

    queryOpen = () => {
        return this.query(
            Q.where('state', 'open')
        );
    }

    queryHasParent = (parentId: string) => {
        return this.query(
            Q.where('parent_id', parentId)
        );
    }

    queryDueToday = () => {
        return this.query(
            ...[ ...Conditions.dueToday()]
        );
    }

    queryDueSoonToday = () => {
        return this.query(
            ...[ ...Conditions.dueToday(), ...Conditions.dueInFuture()]
        );
    }

    queryOverdue = () => {
        return this.query(
            ...[...Conditions.overdue()]
        );
    }

    queryInSCycle = (cycleId: string) => {
        return this.query(
            Q.where(TaskSchema.name.PARENT, cycleId )
        )
    }

    /**
     * Query for tasks that are active, and due either today, or in the past (overdue).
     */
    queryDueOrOverdue = () => {
        return this.query(
            Q.or(
                Q.and(
                    ...[ ...Conditions.overdue()]
                ),
                Q.and(
                    ...[ ...Conditions.dueToday()]
                )
            )
        )
    }

    queryStartedButNotDue = () => {
        return this.query(
            ...[ ...Conditions.started(), ...Conditions.notDue()]
        )
    }

    queryNotStarted = () => {
        return this.query(
            ...[ ...Conditions.notStarted()]
        );
    }

    queryRemainingToday = () => {
        return this.query(
            Q.or(
                Q.and(
                    ...[...Conditions.dueToday()]
                ),
                Q.and(
                    ...[...Conditions.started(), ...Conditions.notDue()]
                ),
            )
        )
    }

}

export class ChildTaskQuery extends ModelQuery<Task, ITask> { 
    parent: string;
    constructor(parent: string) {
        super(TaskSchema.table);
        this.parent = parent;
    }

    default = () => {
        let def = new TaskQuery().default();
        def.parentId = this.parent;
        return def;
    }

    queries = () => {
        return new TaskQuery().queries().concat([
            Q.where(TaskSchema.name.PARENT, this.parent)
        ]);
    }

    queryInactive = () => {
        return this.query(
            ...Conditions.inactive()
        );
    }

    queryCompleted = () => {
        return this.query(
            ...[...Conditions.complete()]
        )
    }

}

export {
    Task,
    ITask,
}

export class TaskLogic {
    id: string;
    constructor(id: string) {
        this.id = id;
    }

    static create = async (d: Partial<ITask>) => {
        const parentId = d.parentId ? d.parentId : ""
        const parentGoal = await new GoalQuery().get(parentId);
        const tx = await ActiveTransaction.new();

        // Default is that dueDate is calculated from start date where possible.
        if(d.startDate) {
            d.dueDate = dueDate(d.startDate);
        }

        if(parentGoal && parentGoal.isStreak()) {
            // We need to create a task, and add it to the current cycle
            // We should create the CURRENT cycle if it doesn't exist yet,
            // but we won't mark it as the LATEST cycle because this isn't generated through
            // the automatic processing.
            //
            // We won't have transaction conflicts, because only one transaction is allowed to be 
            // active at a time.

            let currentCycle = await new ChildStreakCycleQuery(parentGoal.id).inCurrentCycle();
            let finalCurrentCycle: StreakCycle;
            if(!currentCycle) {
                finalCurrentCycle = tx.addCreate(new StreakCycleQuery(), {
                    parentGoalId: parentGoal.id,
                    startDate: parentGoal.currentCycleStart(),
                    endDate: parentGoal.currentCycleEnd(),
                })
            } else {
                finalCurrentCycle = currentCycle; 
                d.parentId = finalCurrentCycle.id;  // reassign the parent field to the cycle where it belongs.
            }

            tx.addCreate(new TaskQuery(), d);
        } else {
            //If the parent is a task instead, we inherit start and due dates from the parent. ALWAYS.
            const parentTask = await new TaskQuery().get(parentId);
            if(parentTask) {
                d.startDate = parentTask.startDate;
                d.dueDate = parentTask.dueDate;
            }

            // We need to create a normal single task based on the data.
            // So we don't need to do anything here.
            tx.addCreate(new TaskQuery(), d);
        }
        tx.commitAndReset();
    }

    update = async (d: Partial<ITask>) => {
        const task = await new TaskQuery().get(this.id);
        const tx = await ActiveTransaction.new();

        // Default is that dueDate is calculated from start date where possible.
        if(d.startDate) {
            d.dueDate = dueDate(d.startDate);
        }

        if(task) {
            // For now, every update to the task requires updating all the children's child dates as well.
            tx.addUpdate(new TaskQuery(), task, d);
            tx.consume(await this._actionTaskAndDescendants("updateDates", task.id, true))
        }
        tx.commitAndReset();
    }

    static cloneRelativeTo = (oldDate, newDate: Date, task: Task) => {
        const newTask : Omit<ITask, "createdAt" | "completedDate"> = {
            title: task.title,
            parentId: task.parentId,
            instructions: task.instructions,
            active: true,
            state: 'open',
            startDate: new MyDate(newDate).add( new MyDate(task.startDate).diff(oldDate, "minutes"), "minutes").toDate(),
            dueDate: new MyDate(newDate).add( new MyDate(task.dueDate).diff(oldDate, "minutes"), "minutes").toDate(),
            parentType: task.parentType,
        }
        return newTask;
    }

    complete = async () => {
        await this.actionTaskAndDescendants("complete", this.id)
    }

    fail = async () => {
        await this.actionTaskAndDescendants("fail", this.id);
    }

    private actionTaskAndDescendants = async (action: "complete" | "fail", id: string) => {
        const tx = await ActiveTransaction.new();
        tx.consume(await this._actionTaskAndDescendants(action, id))
        await tx.commitAndReset();
    }
    
    private _actionTaskAndDescendants = async (action: "complete" | "fail" | "updateDates", id: string, onlyChildren?: true) => {
        const task: Task | null = await new TaskQuery().get(id);
        const tx = await InactiveTransaction.new();
        if(task) {
            const allTasks: Task[] = await findAllChildrenIn(TaskSchema.table, task.id, onlyChildren ? [] : [task]);
            const update = getUpdate(action, task);
            allTasks.forEach((task: Task) => {
                tx.addUpdate(new TaskQuery(), task, update)
            });
        }
        return tx;

        function getUpdate(action: "complete" | "fail" | "updateDates", task: Task) {
            switch(action) {
                case "complete": {
                    return {
                        active: false,
                        state: "complete",
                        completedDate: MyDate.Now().toDate(),
                    } as const;
                } 
                case "fail": {
                    return {
                        active: false,
                        state: "cancelled",
                    } as const;
                }
                case "updateDates": {
                    return {
                        startDate: task.startDate,
                        dueDate: task.dueDate,
                    } as const;
                }
            }
        }
    }
}