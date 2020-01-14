import ModelQuery from "src/Models/base/Query";
import {
    Task, ITask,
} from "src/Models/Task/Task";
import TaskSchema from "src/Models/Task/TaskSchema";
import { Q } from "@nozbe/watermelondb";



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
        } as const;
    }

    queryHasParent = (parentId: string) => {
        return this.store().query(
            Q.where('parent_id', parentId),
        );
    }
}

export {
    TaskQuery,
    Task,
}