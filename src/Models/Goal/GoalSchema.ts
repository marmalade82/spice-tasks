import { ColumnType } from "@nozbe/watermelondb"
import { ChildSchema, StateSchema, ActiveSchema, Schema, ProcessedSchema } from "src/Models/base/SharedSchema"

const GoalName = {
    TITLE: 'title',
    DETAILS: 'details',
    TYPE: 'type',
    STARTS_AT: 'starts_at',
    DUE_AT: 'due_at',
    STREAK_MIN: 'streak_minimum',
    STREAK_TYPE: 'streak_type',
    STREAK_DAILY_START: 'streak_daily_start',
    STREAK_WEEKLY_START: 'streak_weekly_start',
    STREAK_MONTHLY_START: 'streak_monthly_start',
    PARENT: 'parent_id',
    PARENT_TABLE: 'parent_table',
    ACTIVE: 'is_active',
    STATE: 'state',
    REWARD_TYPE: 'reward_type',
    RECUR_ID: 'recur_id',
    LATEST_CYCLE: 'latest_cycle_id',
    LAST_REFRESHED: 'last_refreshed_at',
    REWARD_ID: 'reward_id',
    PENALTY_TYPE: 'penalty_type',
    PENALTY_ID: 'penalty_id',
} as const;

const GoalType = {
    TITLE: 'string',
    DETAILS: 'string',
    TYPE: 'string',
    STARTS_AT: 'number',
    DUE_AT: 'number',
    STREAK_MIN: 'number',
    STREAK_TYPE: 'string',
    STREAK_DAILY_START: 'number',
    STREAK_WEEKLY_START: 'string',
    STREAK_MONTHLY_START: 'number',
    PARENT: 'string',
    PARENT_TABLE: 'string',
    ACTIVE: 'boolean',
    STATE: 'string',
    REWARD_TYPE: 'string',
    RECUR_ID: 'string',
    LATEST_CYCLE: 'string',
    LAST_REFRESHED: 'number',
    REWARD_ID: 'string',
    PENALTY_TYPE: 'string',
    PENALTY_ID: 'string',
} as const;

const GoalSchema: ChildSchema & ActiveSchema & StateSchema & 
                    ProcessedSchema & Schema<typeof GoalName> = {
    name: GoalName,
    type: GoalType,
    table: 'goals',
} as const;

export default GoalSchema;