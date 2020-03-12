
import { choice } from "src/Models/common/logicUtils";

export enum PenaltyTypes {
    NONE = "none",
    SPECIFIC = "specific",
}

type PenaltyChoice = {
    label: string,
    value: PenaltyTypes,
    key: PenaltyTypes,
}

export const PenaltyChoices: PenaltyChoice[] = [
    choice("None", PenaltyTypes.NONE),
    choice("Choose my own", PenaltyTypes.SPECIFIC),
]

export default class PenaltyLogic {
    id: string;
    constructor(id: string) {
        this.id = id;
    }
}