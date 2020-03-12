import { choice } from "src/Models/common/logicUtils";

enum RewardTypes {
    NONE = "none",
    TWO_DICE = "two_dice",
    LOOTBOX = "lootbox",
    COIN_FLIP = "coin_flip",
    WHEEL = "spin_wheel",
    SPECIFIC = "specific",
}


type RewardType = 
    RewardTypes.TWO_DICE | RewardTypes.LOOTBOX | RewardTypes.COIN_FLIP | 
    RewardTypes.WHEEL | RewardTypes.SPECIFIC | RewardTypes.NONE;

type RewardChoice = {
    label: string;
    value: RewardType;
    key: RewardType;
}

const RewardChoices: RewardChoice[] = [
    choice("None", RewardTypes.NONE, RewardTypes.NONE),
    //choice("Dice", RewardTypes.TWO_DICE, RewardTypes.TWO_DICE),
    //choice("Lootbox", RewardTypes.LOOTBOX),
    //choice("Coin flip", RewardTypes.COIN_FLIP),
    //choice("Spin the wheel", RewardTypes.WHEEL),
    choice("Choose my own", RewardTypes.SPECIFIC, RewardTypes.SPECIFIC)
]

export {
    RewardType,
    RewardTypes as RewardTypes,
    RewardChoices,
}

export default class RewardLogic {
    id: string;
    constructor(id: string) {
        this.id = id;
    }
}