
import { ColumnType } from "@nozbe/watermelondb"

const EarnedRewardName = {
    EARNED_ON: "earned_at",
    ACTIVE: "active",
    TYPE: "reward_type",
    GOAL_ID: "goal_id",
}

const EarnedRewardType: Record<keyof typeof EarnedRewardName, ColumnType> = {
    EARNED_ON: "number",
    ACTIVE: "boolean",
    TYPE: "string",
    GOAL_ID: "string",
}

const EarnedRewardSchema = {
    name: EarnedRewardName,
    type: EarnedRewardType,
    table: "earned_rewards",
}

export default EarnedRewardSchema;