
import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";
import TaskSchema from "src/Models/Task/TaskSchema";


interface ITask {
    title: string;
    startDate: Date;
    dueDate: Date;
    instructions: string;
}

const name = TaskSchema.name

export default class Task extends Model implements ITask {
    static table = TaskSchema.table

    @field(name.TITLE) title
    @date(name.STARTS_ON) startDate
    @date(name.DUE_ON) dueDate 
    @field(name.INSTRUCTIONS) instructions
}

export {
    Task,
    ITask,
}