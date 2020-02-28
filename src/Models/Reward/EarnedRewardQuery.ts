
import ModelQuery from "src/Models/base/Query";
import {
    EarnedReward, IEarnedReward,
} from "src/Models/Reward/EarnedReward";
import EarnedRewardSchema from "src/Models/Reward/EarnedRewardSchema";
import { RewardTypes } from "./RewardLogic";
import { Q } from "@nozbe/watermelondb";
import { Conditions } from "src/Models/common/queryUtils";

export default class EarnedRewardQuery extends ModelQuery<EarnedReward, IEarnedReward> {
    constructor() {
        super(EarnedRewardSchema.table);
    }

    queries = () => {
        return [
            Q.where(EarnedRewardSchema.name.CLASS_TYPE, "reward")
        ];
    }

    default = () => {
        return {
            earnedDate: new Date(),
            active: true,
            type: RewardTypes.SPECIFIC,
            goalId: "",
            title: "",
            details: "",
            classType: "reward",
        } as const
    }

    queryUnused = () => {
        return this.query(
            ...[
                ...Conditions.active()
            ]
        );
    }
}

export {
    EarnedRewardQuery,
    EarnedReward,
}