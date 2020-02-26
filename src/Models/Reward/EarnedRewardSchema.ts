
import { ColumnType } from "@nozbe/watermelondb"
import { ActiveSchema, Schema } from "src/Models/base/SharedSchema"

const EarnedRewardName = {
    EARNED_ON: "earned_at",
    ACTIVE: "is_active",
    TYPE: "reward_type",
    GOAL_ID: "goal_id",
    TITLE: "title",
    DETAILS: "details",
    CLASS_TYPE: 'class_type',
} as const

const EarnedRewardType = {
    EARNED_ON: "number",
    ACTIVE: "boolean",
    TYPE: "string",
    GOAL_ID: "string",
    TITLE: "string",
    DETAILS: "string",
    CLASS_TYPE: 'string',
} as const

const EarnedRewardSchema: ActiveSchema & Schema<typeof EarnedRewardName> = {
    name: EarnedRewardName,
    type: EarnedRewardType,
    table: "earnedrewards",
}

export default EarnedRewardSchema;