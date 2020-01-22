
import ModelQuery from "src/Models/base/Query";
import {
    EarnedReward, IEarnedReward,
} from "src/Models/Reward/EarnedReward";
import EarnedRewardSchema from "src/Models/Reward/EarnedRewardSchema";

export default class EarnedRewardQuery extends ModelQuery<EarnedReward, IEarnedReward> {
    constructor() {
        super(EarnedRewardSchema.table);
    }

    default = () => {
        return {
            earnedDate: new Date(),
            active: true,
            type: "none",
            goalId: "",
        } as const
    }
}

export {
    EarnedRewardQuery,
    EarnedReward,
}