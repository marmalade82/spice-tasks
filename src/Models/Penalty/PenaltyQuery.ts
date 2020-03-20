
import ModelQuery from "src/Models/base/Query";
import {
    Penalty, IPenalty,
} from "src/Models/Penalty/Penalty";
import RewardSchema from "src/Models/Reward/RewardSchema";
import { Q } from "@nozbe/watermelondb";
import MyDate from "src/common/Date";

export default class PenaltyQuery extends ModelQuery<Penalty, IPenalty> {
    constructor() {
        super(RewardSchema.table);
    }

    queries = () => {
        return [
            Q.where(RewardSchema.name.TYPE, "penalty")
        ];
    }

    default = () => {
        return {
            title: "Default Penalty",
            details: "",
            expireDate: MyDate.Now().toDate(),
            type: "penalty",
        } as const;
    }
}

export {
    PenaltyQuery,
    Penalty,
}