
import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";
import ClaimedRewardSchema from "src/Models/Reward/ClaimedRewardSchema";

interface IClaimedReward {
    title: string,
    details: string,
    claimedDate: Date,
    completedDate: Date,
    earnedId: string,
    type: "reward" | "penalty",
}

const name = ClaimedRewardSchema.name;

export default class ClaimedReward extends Model implements IClaimedReward {
    static table = ClaimedRewardSchema.table

    @field(name.TITLE) title 
    @field(name.DETAILS) details 
    @date(name.CLAIMED_ON) claimedDate
    @date(name.COMPLETED_ON) completedDate
    @field(name.EARNED_ID) earnedId
    @field(name.TYPE) type
}

export {
    IClaimedReward,
    ClaimedReward,
}