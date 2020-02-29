
import { Model } from "@nozbe/watermelondb";
import { field, date, relation, action, readonly} from "@nozbe/watermelondb/decorators";
import TaskSchema from "src/Models/Task/TaskSchema";
import GoalSchema from "src/Models/Goal/GoalSchema";

export enum TaskParentTypes {
    GOAL = "goal",
    TASK = "task",
}

interface ITask {
    title: string;
    startDate: Date;
    dueDate: Date;
    instructions: string;
    parentId: string;
    parentType: TaskParentTypes
    active: boolean;
    state: 'open' | 'in_progress' | 'complete' | 'cancelled';
    completedDate: Date;
    createdAt: Date;
}

const name = TaskSchema.name

export default class Task extends Model implements ITask {
    static table = TaskSchema.table
    static associations = {
        [GoalSchema.table]: {
            type: "belongs_to",
            key: name.PARENT,
        } as const,
        [TaskSchema.table]: {
            type: "belongs_to",
            key: name.PARENT,
        } as const,
    }

    @field(name.TITLE) title!: string
    @date(name.STARTS_ON) startDate!: Date
    @date(name.DUE_ON) dueDate!: Date
    @field(name.INSTRUCTIONS) instructions!: string
    @field(name.PARENT) parentId! : string
    @field(name.ACTIVE) active! : boolean
    @field(name.STATE) state! : 'open' | 'in_progress' | 'complete' | 'cancelled';
    @date(name.COMPLETED_ON) completedDate! : Date
    @date(name.CREATED_ON) createdAt!: Date
    @field(name.PARENT_TABLE) parentType!: TaskParentTypes;

    /* Relations */
    @relation(GoalSchema.table, name.PARENT) parentGoal
    @relation(TaskSchema.table, name.PARENT) parentTask

    /* Actions */
    @action async createChild(child: ITask) {
        await this.collections.get(Task.table).create((task: Task) => {
            Object.assign(task, child);
            task.parentId = this.id;
        });
    }
}

export {
    Task,
    ITask,
}