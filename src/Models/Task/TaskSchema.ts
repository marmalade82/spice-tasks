
import { ColumnType } from "@nozbe/watermelondb"
import { ChildSchema, Schema, } from "src/Models/base/SharedSchema"


const TaskName = {
    TITLE: 'title',
    STARTS_ON: 'starts_at',
    DUE_ON: 'due_on',
    INSTRUCTIONS: 'instructions',
    PARENT: 'parent_id' as "parent_id",
}

const TaskType: Record<keyof typeof TaskName, ColumnType> = {
    TITLE: 'string',
    STARTS_ON: 'number',
    DUE_ON: 'number',
    INSTRUCTIONS: 'string',
    PARENT: 'string',
}

export const TaskSchema: Schema<typeof TaskName, 'tasks'> & ChildSchema = {
    table: 'tasks',
    name: TaskName,
    type: TaskType,
}

export default TaskSchema