
import { ColumnType } from "@nozbe/watermelondb"

const EarnedRewardName = {
    EARNED_ON: "earned_at",
    ACTIVE: "active",
    TYPE: "reward_type",
    GOAL_ID: "goal_id",
    TITLE: "title",
    DETAILS: "details",
    CLASS_TYPE: 'class_type',
}

const EarnedRewardType: Record<keyof typeof EarnedRewardName, ColumnType> = {
    EARNED_ON: "number",
    ACTIVE: "boolean",
    TYPE: "string",
    GOAL_ID: "string",
    TITLE: "string",
    DETAILS: "string",
    CLASS_TYPE: 'string',
}

const EarnedRewardSchema = {
    name: EarnedRewardName,
    type: EarnedRewardType,
    table: "earnedrewards",
}

export default EarnedRewardSchema;