
import ModelQuery from "src/Models/base/Query";
import {
    EarnedReward, IEarnedReward,
} from "src/Models/Reward/EarnedReward";
import EarnedRewardSchema from "src/Models/Reward/EarnedRewardSchema";
import { Rewards } from "./RewardLogic";

export default class EarnedRewardQuery extends ModelQuery<EarnedReward, IEarnedReward> {
    constructor() {
        super(EarnedRewardSchema.table);
    }

    queries = () => {
        return [];
    }

    default = () => {
        return {
            earnedDate: new Date(),
            active: true,
            type: Rewards.SPECIFIC,
            goalId: "",
            title: "",
            details: "",
        } as const
    }

    queryUnused = () => {
        return this.queryAll();
    }
}

export {
    EarnedRewardQuery,
    EarnedReward,
}