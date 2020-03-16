import EarnedRewardQuery, { EarnedReward} from "src/Models/Reward/EarnedRewardQuery";
import PenaltyQuery from "src/Models/Penalty/PenaltyQuery";
import MyDate from "src/common/Date";
import { PenaltyTypes } from "./PenaltyLogic";
import EarnedPenaltyQuery from "./EarnedPenaltyQuery";
import ActiveTransaction, { InactiveTransaction } from "../common/Transaction";



export default class EarnedPenaltyLogic {
    id: string;
    earned?: EarnedReward;  // This is still an earned reward -- because the penalty was earned from a reward
    constructor(id: string) {
        this.id = id;
    }

    static earnSpecific = async (penaltyId: string, goalId: string) => {
        const tx = InactiveTransaction.new();
        const penalty = await new PenaltyQuery().get(penaltyId);
        if(penalty) {
            const title = penalty.title;
            const details = penalty.details;
            tx.addCreate(new EarnedPenaltyQuery(), {
                title: title,
                details: details,
                goalId: goalId,
                type: PenaltyTypes.SPECIFIC
            });
        }
        return tx;
    }

    use = async () => {
        let earned = await new EarnedPenaltyQuery().get(this.id);
        if(earned) {
            const tx = await ActiveTransaction.new();
            tx.addUpdate(new EarnedPenaltyQuery(), earned, {
                active: false,
            })

            await tx.commitAndReset();
        }
    }
}