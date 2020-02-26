
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
    choice("Choose your own", PenaltyTypes.SPECIFIC),
]