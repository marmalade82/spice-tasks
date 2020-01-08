import { ColumnType } from "@nozbe/watermelondb"

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
}

const GoalType: Record<keyof typeof GoalName, ColumnType> = {
    TITLE: 'string',
    TYPE: 'string',
    STARTS_AT: 'number',
    DUE_AT: 'number',
    STREAK_MIN: 'number',
    STREAK_TYPE: 'string',
    STREAK_DAILY_START: 'number',
    STREAK_WEEKLY_START: 'string',
    STREAK_MONTHLY_START: 'number',
}

const GoalSchema = {
    name: GoalName,
    type: GoalType,
}

export default GoalSchema;