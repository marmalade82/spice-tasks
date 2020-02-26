
import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";
import EarnedRewardSchema from "src/Models/Reward/EarnedRewardSchema";
import { PenaltyTypes } from "src/Models/Penalty/PenaltyLogic";



interface IEarnedPenalty {
    earnedDate: Date,
    active : boolean,
    type: Exclude<PenaltyTypes, "none">,
    goalId: string,
    title: string,
    details: string,
    classType: "penalty",
}

const name = EarnedRewardSchema.name

export default class EarnedPenalty extends Model implements IEarnedPenalty {
    static table = EarnedRewardSchema.table

    @date(name.EARNED_ON) earnedDate!: Date
    @field(name.ACTIVE) active! : boolean
    @field(name.TYPE) type!: Exclude<PenaltyTypes, "none">;
    @field(name.GOAL_ID) goalId!: string;
    @field(name.TITLE) title!: string;
    @field(name.DETAILS) details!: string;
    @field(name.CLASS_TYPE) classType!: "penalty";
}

export {
    EarnedPenalty,
    IEarnedPenalty,
}