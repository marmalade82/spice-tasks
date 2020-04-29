
import { 
    ActiveSchema, ChildSchema, Schema, 
    StateSchema, DueSchema,
} from "src/Models/base/SharedSchema"


const TaskName = {
    TITLE: 'title',
    STARTS_ON: 'starts_at',
    START_TIME_ON: 'starttime_at',
    DUE_ON: 'due_at',
    INSTRUCTIONS: 'instructions',
    PARENT: 'parent_id',
    PARENT_TABLE: 'parent_table',
    ACTIVE: 'is_active',
    STATE: 'state',
    COMPLETED_ON : 'completed_at',
    CREATED_ON : 'created_at',
} as const;

const TaskType = {
    TITLE: 'string',
    STARTS_ON: 'number',
    START_TIME_ON: 'number',
    DUE_ON: 'number',
    INSTRUCTIONS: 'string',
    PARENT: 'string',
    PARENT_TABLE: 'string',
    ACTIVE: 'boolean',
    STATE: 'string',
    COMPLETED_ON: 'number',
    CREATED_ON: 'number',
} as const

export const TaskSchema: DueSchema & ChildSchema & StateSchema & ActiveSchema & Schema<typeof TaskName> = {
    table: 'tasks',
    name: TaskName,
    type: TaskType,
} as const;

export default TaskSchema