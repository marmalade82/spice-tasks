
import { ColumnType } from "@nozbe/watermelondb"


const ClaimedRewardName = {
    TITLE: "title",
    DETAILS: "details",
    CLAIMED_ON: "claimed_at",
    COMPLETED_ON: "completed_on",
    EARNED_ID: "earned_id",
}

const ClaimedRewardType: Record<keyof typeof ClaimedRewardName, ColumnType>= {
    TITLE: "string",
    DETAILS: "string",
    CLAIMED_ON: "number", // this is very much like a created at date. Should I just use that instead? Nah.
    COMPLETED_ON: "number",
    EARNED_ID: "string",
}

const ClaimedRewardSchema = {
    name: ClaimedRewardName,
    type: ClaimedRewardType,
    table: "claimed_rewards",
}

export default ClaimedRewardSchema;