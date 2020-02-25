
import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";
import EarnedRewardSchema from "src/Models/Reward/EarnedRewardSchema";
import { RewardType } from "src/Models/Reward/RewardLogic";

interface IEarnedReward {
    earnedDate: Date,
    active : boolean,
    type: Exclude<RewardType, "none">,
    goalId: string,
    title: string,
    details: string,
}

const name = EarnedRewardSchema.name;

export default class EarnedReward extends Model implements IEarnedReward {
    static table = EarnedRewardSchema.table

    @date(name.EARNED_ON) earnedDate!: Date
    @field(name.ACTIVE) active! : boolean
    @field(name.TYPE) type!: Exclude<RewardType, "none">;
    @field(name.GOAL_ID) goalId!: string;
    @field(name.TITLE) title!: string;
    @field(name.DETAILS) details!: string;

}

export {
    EarnedReward,
    IEarnedReward,
}