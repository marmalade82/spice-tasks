
import ModelQuery from "src/Models/base/Query";
import {
    EarnedPenalty, IEarnedPenalty,
} from "src/Models/Penalty/EarnedPenalty";
import EarnedRewardSchema from "src/Models/Reward/EarnedRewardSchema";
import { PenaltyTypes } from "./PenaltyLogic";
import { Q } from "@nozbe/watermelondb";

export default class EarnedPenaltyQuery extends ModelQuery<EarnedPenalty, IEarnedPenalty> {
    constructor() {
        super(EarnedRewardSchema.table);
    }

    queries = () => {
        return [
            Q.where(EarnedRewardSchema.name.CLASS_TYPE, "penalty")
        ];
    }

    default = () => {
        return {
            earnedDate: new Date(),
            active: true,
            type: PenaltyTypes.SPECIFIC,
            goalId: "",
            title: "",
            details: "",
            classType: "penalty",
        } as const
    }

    queryUnused = () => {
        return this.queryAll();
    }
}

export {
    EarnedPenaltyQuery,
    EarnedPenalty,
}