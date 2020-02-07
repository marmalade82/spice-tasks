
import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";
import EarnedRewardSchema from "src/Models/Reward/EarnedRewardSchema";
import { RewardType } from "src/Models/Reward/RewardLogic";

interface IEarnedReward {
    earnedDate: Date,
    active : boolean,
    type: RewardType,
    goalId: string,
}

const name = EarnedRewardSchema.name;

export default class EarnedReward extends Model implements IEarnedReward {
    static table = EarnedRewardSchema.table

    @date(name.EARNED_ON) earnedDate
    @field(name.ACTIVE) active
    @field(name.TYPE) type
    @field(name.GOAL_ID) goalId

}

export {
    EarnedReward,
    IEarnedReward,
}