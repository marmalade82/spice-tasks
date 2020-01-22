
import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";
import EarnedRewardSchema from "src/Models/Reward/EarnedRewardSchema";

interface IEarnedReward {
    earnedDate: Date,
    active : boolean,
    type: "two_dice" | "lootbox" | "coin_flip" | "spin_wheel" | "specific" | "none"
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