import { ColumnType } from "@nozbe/watermelondb"
import { ChildSchema, Schema } from "src/Models/base/SharedSchema"

const GoalName = {
    TITLE: 'title',
    TYPE: 'type',
    STARTS_AT: 'starts_at',
    DUE_AT: 'due_at',
    STREAK_MIN: 'streak_minimum',
    STREAK_TYPE: 'streak_type',
    STREAK_DAILY_START: 'streak_daily_start',
    STREAK_WEEKLY_START: 'streak_weekly_start',
    STREAK_MONTHLY_START: 'streak_monthly_start',
    PARENT: 'parent_id',
} as const;

const GoalType = {
    TITLE: 'string',
    TYPE: 'string',
    STARTS_AT: 'number',
    DUE_AT: 'number',
    STREAK_MIN: 'number',
    STREAK_TYPE: 'string',
    STREAK_DAILY_START: 'number',
    STREAK_WEEKLY_START: 'string',
    STREAK_MONTHLY_START: 'number',
    PARENT: 'string',
} as const;

const GoalSchema: ChildSchema & Schema<typeof GoalName> = {
    name: GoalName,
    type: GoalType,
    table: 'goals',
} as const;

export default GoalSchema;