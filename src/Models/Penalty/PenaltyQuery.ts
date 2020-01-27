
import ModelQuery from "src/Models/base/Query";
import {
    Penalty, IPenalty,
} from "src/Models/Penalty/Penalty";
import { PenaltySchema } from "src/Models/Penalty/PenaltySchema";



export default class PenaltyQuery extends ModelQuery<Penalty, IPenalty> {
    constructor() {
        super(PenaltySchema.table);
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