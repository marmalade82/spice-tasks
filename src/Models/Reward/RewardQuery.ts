
import ModelQuery from "src/Models/base/Query";
import {
    Reward, IReward,
} from "src/Models/Reward/Reward";
import RewardSchema from "src/Models/Reward/RewardSchema";



export default class RewardQuery extends ModelQuery<Reward, IReward> {
    constructor() {
        super(RewardSchema.table);
    }

    default = () => {
        return {
            title: "Default Task",
            details: "",
            expireDate: new Date(),
        } as const;
    }
}

export {
    RewardQuery,
    Reward,
}