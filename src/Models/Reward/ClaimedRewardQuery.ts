
import ModelQuery from "src/Models/base/Query";
import {
    ClaimedReward, IClaimedReward,
} from "src/Models/Reward/ClaimedReward";
import ClaimedRewardSchema from "src/Models/Reward/ClaimedRewardSchema";
import MyDate from "src/common/Date";

export default class ClaimedRewardQuery extends ModelQuery<ClaimedReward, IClaimedReward> {
    constructor() {
        super(ClaimedRewardSchema.table);
    }

    queries = () => {
        return [];
    }

    default = () => {
        return {
            title: "Default claimed reward",
            details: "Default details",
            claimedDate: MyDate.Zero().toDate(),
            completedDate: MyDate.Zero().toDate(),
            earnedId: "",
            type: "reward"
        } as const
    }
}

export {
    ClaimedRewardQuery,
    ClaimedReward,
}