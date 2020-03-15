import EarnedRewardQuery, { EarnedReward} from "src/Models/Reward/EarnedRewardQuery";
import PenaltyQuery from "src/Models/Penalty/PenaltyQuery";
import ClaimedRewardQuery from "src/Models/Reward/ClaimedRewardQuery"
import MyDate from "src/common/Date";
import { PenaltyTypes } from "./PenaltyLogic";
import EarnedPenaltyQuery from "./EarnedPenaltyQuery";
import { InactiveTransaction } from "../common/Transaction";



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
            await new EarnedPenaltyQuery().update(earned, {
                active: false,
            });
        }
    }

    _fetchEarned = async () => {
        if(this.earned) {
            return this.earned;
        } else {
            const earned = await new EarnedRewardQuery().get(this.id);
            if(earned) {
                this.earned = earned;
            } else {
                this.earned = undefined;
            }
        }
    }

    claimPenalty = async (penaltyId: string) => {
        const earned = await this._fetchEarned();

        if(earned) {
            const reward = await new PenaltyQuery().get(penaltyId);

            if(reward) {
                await new ClaimedRewardQuery().create({
                    title: reward.title,
                    details: reward.details,
                    claimedDate: new MyDate().toDate(),
                    earnedId: this.id,
                });
            }
        }
    }

}