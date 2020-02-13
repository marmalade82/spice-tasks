
import { Model } from "@nozbe/watermelondb";
import { field, date, relation, action} from "@nozbe/watermelondb/decorators";
import TaskSchema from "src/Models/Task/TaskSchema";
import GoalSchema from "src/Models/Goal/GoalSchema";


interface ITask {
    title: string;
    startDate: Date;
    dueDate: Date;
    instructions: string;
    parentId: string;
    active: boolean;
    state: 'open' | 'in_progress' | 'complete' | 'cancelled';
    completedDate: Date;
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

    @field(name.TITLE) title
    @date(name.STARTS_ON) startDate
    @date(name.DUE_ON) dueDate 
    @field(name.INSTRUCTIONS) instructions
    @field(name.PARENT) parentId
    @field(name.ACTIVE) active
    @field(name.STATE) state
    @date(name.COMPLETED_ON) completedDate

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