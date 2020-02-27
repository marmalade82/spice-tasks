import { choice } from "src/Models/common/logicUtils";

enum Rewards {
    NONE = "none",
    TWO_DICE = "two_dice",
    LOOTBOX = "lootbox",
    COIN_FLIP = "coin_flip",
    WHEEL = "spin_wheel",
    SPECIFIC = "specific",
}


type RewardType = 
    Rewards.TWO_DICE | Rewards.LOOTBOX | Rewards.COIN_FLIP | 
    Rewards.WHEEL | Rewards.SPECIFIC | Rewards.NONE;

type RewardChoice = {
    label: string;
    value: RewardType;
    key: RewardType;
}

const RewardChoices: RewardChoice[] = [
    choice("None", Rewards.NONE, Rewards.NONE),
    choice("Dice", Rewards.TWO_DICE, Rewards.TWO_DICE),
    choice("Lootbox", Rewards.LOOTBOX),
    choice("Coin flip", Rewards.COIN_FLIP),
    choice("Spin the wheel", Rewards.WHEEL),
    choice("Choose my own", Rewards.SPECIFIC, Rewards.SPECIFIC)
]

export {
    RewardType,
    Rewards,
    RewardChoices,
}

export default class RewardLogic {
    id: string;
    constructor(id: string) {
        this.id = id;
    }
}