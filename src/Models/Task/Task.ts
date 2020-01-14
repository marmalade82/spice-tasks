
import { Model } from "@nozbe/watermelondb";
import { field, date, relation} from "@nozbe/watermelondb/decorators";
import TaskSchema from "src/Models/Task/TaskSchema";
import GoalSchema from "src/Models/Goal/GoalSchema";


interface ITask {
    title: string;
    startDate: Date;
    dueDate: Date;
    instructions: string;
    parentId: string;
    active: boolean;
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

    /* Relations */
    @relation(GoalSchema.table, name.PARENT) parentGoal
    @relation(TaskSchema.table, name.PARENT) parentTask
}

export {
    Task,
    ITask,
}