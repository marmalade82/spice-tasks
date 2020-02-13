import ModelQuery from "src/Models/base/Query";
import {
    Task, ITask,
} from "src/Models/Task/Task";
import TaskSchema from "src/Models/Task/TaskSchema";
import { Q, Database, Model } from "@nozbe/watermelondb";
import { Conditions } from "src/Models/common/queryUtils"
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
            completedDate: MyDate.Zero().toDate()
        } as const;
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

    completeTaskAndDescendants = async (opts: { id: string}) => {
        if(opts.id !== '') {
            try {
                const parent: Task = await this.store().find(opts.id) as Task;
                const allTasks: Task[] = await this._findAllChildren(parent.id, [parent]);
                const allTasksPrep = allTasks.map((task: Task) => {
                    return task.prepareUpdate((t: ITask) => {
                        t.active = false;
                        t.state = 'complete';
                        t.completedDate = new Date() // it was completed today.
                    });
                });

                DB.get().action(async() => {
                    DB.get().batch(...allTasksPrep);
                })
            } catch (e) {
                console.log(e);
                throw e;
            }
        }
    }


    /** 
     * Potentially very slow operation, since it's an exhaustive DFS.
    */
    _findAllChildren = async (id: string, tasks: Task[]): Promise<Task[]> => {
        if(id === '') {
            return tasks;
        }

        const children = await this.store().query(
            Q.where('parent_id', id)
        ).fetch()

        const descendants = await Promise.all(children.map(async (child: Task) => {
            return await this._findAllChildren(child.id, [child])
        }));

        return descendants.flat().concat(tasks);
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
}

export {
    TaskQuery,
    Task,
    ITask,
}