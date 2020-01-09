
import { ColumnType } from "@nozbe/watermelondb"


const TaskName = {
    TITLE: 'title',
    STARTS_ON: 'starts_at',
    DUE_ON: 'due_on',
    INSTRUCTIONS: 'instructions',
}

const TaskType: Record<keyof typeof TaskName, ColumnType> = {
    TITLE: 'string',
    STARTS_ON: 'number',
    DUE_ON: 'number',
    INSTRUCTIONS: 'string',
}

export const TaskSchema = {
    table: 'tasks',
    name: TaskName,
    type: TaskType,
}

export default TaskSchema