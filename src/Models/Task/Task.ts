
import { Model } from "@nozbe/watermelondb";
import { field, date, relation, action, readonly} from "@nozbe/watermelondb/decorators";
import TaskSchema from "src/Models/Task/TaskSchema";
import GoalSchema from "src/Models/Goal/GoalSchema";
import { assignAll } from "src/common/types";

export enum TaskParentTypes {
    GOAL = "goal",
    TASK = "task",
    CYCLE = "cycle",
    RECUR = "recur",
    NONE = "none",
}

interface ITask {
    title: string;
    startDate: Date;
    startTime: Date;
    dueDate: Date;
    instructions: string;
    active: boolean;
    state: 'open' | 'in_progress' | 'complete' | 'cancelled';
    completedDate: Date;
    createdAt: Date;
    parent: ParentInfo;
    remindMe: boolean;
    reminded: boolean;
}

// TODO FIX OBJECT ASSIGN ISSUE.

interface ParentInfo {
    readonly id: string;
    readonly type: TaskParentTypes;
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
    @field(name.ACTIVE) active! : boolean
    @field(name.STATE) state! : 'open' | 'in_progress' | 'complete' | 'cancelled';
    @date(name.COMPLETED_ON) completedDate! : Date
    @date(name.CREATED_ON) createdAt!: Date;
    @date(name.START_TIME_ON) startTime!: Date;
    @field(name.REMIND) remindMe!: boolean;
    @field(name.REMINDED) reminded!: boolean;

    @field(name.PARENT) private parentId! : string
    @field(name.PARENT_TABLE) private parentType!: TaskParentTypes;

    /* Relations */
    @relation(GoalSchema.table, name.PARENT) parentGoal
    @relation(TaskSchema.table, name.PARENT) parentTask

    /* Actions */
    @action async createChild(child: ITask) {
        await this.collections.get(Task.table).create((task: Task) => {
            assignAll([], task, child);
            task.parentId = this.id;
        });
    }

    get parent() {
        return {
            id: this.parentId,
            type: this.parentType,
        }
    }

    set parent(info: ParentInfo) {
        this.parentId = info.id;
        this.parentType = info.type;
    }
}

export {
    Task,
    ITask,
}