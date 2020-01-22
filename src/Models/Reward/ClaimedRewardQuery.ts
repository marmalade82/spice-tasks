
import ModelQuery from "src/Models/base/Query";
import {
    ClaimedReward, IClaimedReward,
} from "src/Models/Reward/ClaimedReward";
import ClaimedRewardSchema from "src/Models/Reward/ClaimedRewardSchema";

export default class ClaimedRewardQuery extends ModelQuery<ClaimedReward, IClaimedReward> {
    constructor() {
        super(ClaimedRewardSchema.table);
    }

    default = () => {
        return {
            title: "Default claimed reward",
            details: "Default details",
            claimedDate: new Date(),
            completedDate: new Date(),
            earnedId: "",
        } as const
    }
}

export {
    ClaimedRewardQuery,
    ClaimedReward,
}