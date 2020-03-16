import RewardQuery from "src/Models/Reward/RewardQuery"
import EarnedRewardQuery, { EarnedReward } from "src/Models/Reward/EarnedRewardQuery";
import MyDate from "src/common/Date";
import PenaltyQuery from "src/Models/Penalty/PenaltyQuery";
import { RewardTypes } from "./RewardLogic";
import { isBuffer } from "util";
import ActiveTransaction, { InactiveTransaction } from "../common/Transaction";


export default class EarnedRewardLogic {
    id: string;
    earned?: EarnedReward;
    constructor(id: string) {
        this.id = id;
    }

    static earnSpecific = async (rewardId: string, goalId: string) => {
        const tx = InactiveTransaction.new();
        const reward = await new RewardQuery().get(rewardId);
        if(reward) {
            const title = reward.title;
            const details = reward.details;
            tx.addCreate(new EarnedRewardQuery, {
                title: title,
                details: details,
                goalId: goalId,
                type: RewardTypes.SPECIFIC
            })
        }
        return tx;
    }

    use = async() => {
        const earned = await new EarnedRewardQuery().get(this.id);
        if(earned) {
            const tx = await ActiveTransaction.new();
            tx.addUpdate(new EarnedRewardQuery(), earned, {
                active: false,
            })
            await tx.commitAndReset();
        }
    }
}