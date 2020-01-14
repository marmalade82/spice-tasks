
import { ColumnType } from "@nozbe/watermelondb"
import { ActiveSchema, ChildSchema, Schema, } from "src/Models/base/SharedSchema"


const TaskName = {
    TITLE: 'title',
    STARTS_ON: 'starts_at',
    DUE_ON: 'due_on',
    INSTRUCTIONS: 'instructions',
    PARENT: 'parent_id',
    ACTIVE: 'is_active',
} as const;

const TaskType = {
    TITLE: 'string',
    STARTS_ON: 'number',
    DUE_ON: 'number',
    INSTRUCTIONS: 'string',
    PARENT: 'string',
    ACTIVE: 'boolean',
} as const

export const TaskSchema: ChildSchema & ActiveSchema & Schema<typeof TaskName> = {
    table: 'tasks',
    name: TaskName,
    type: TaskType,
} as const;

export default TaskSchema