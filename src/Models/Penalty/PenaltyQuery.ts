
import ModelQuery from "src/Models/base/Query";
import {
    Penalty, IPenalty,
} from "src/Models/Penalty/Penalty";
import RewardSchema from "src/Models/Reward/RewardSchema";



export default class PenaltyQuery extends ModelQuery<Penalty, IPenalty> {
    constructor() {
        super(RewardSchema.table);
    }

    default = () => {
        return {
            title: "Default Penalty",
            details: "",
            expireDate: new Date(),
        } as const;
    }
}

export {
    PenaltyQuery,
    Penalty,
}