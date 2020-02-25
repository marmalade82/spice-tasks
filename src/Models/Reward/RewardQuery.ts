
import ModelQuery from "src/Models/base/Query";
import {
    Reward, IReward,
} from "src/Models/Reward/Reward";
import RewardSchema from "src/Models/Reward/RewardSchema";
import { Q } from "@nozbe/watermelondb";



export default class RewardQuery extends ModelQuery<Reward, IReward> {
    constructor() {
        super(RewardSchema.table);
    }

    queries = () => {
        return [
            Q.where(RewardSchema.name.TYPE, "reward")
        ];
    }

    default = () => {
        return {
            title: "Default Reward",
            details: "",
            expireDate: new Date(),
            type: "reward",
        } as const;
    }
}

export {
    RewardQuery,
    Reward,
}