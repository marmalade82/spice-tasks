import RewardQuery from "src/Models/Reward/RewardQuery"
import ClaimedRewardQuery from "src/Models/Reward/ClaimedRewardQuery";
import EarnedRewardQuery, { EarnedReward } from "src/Models/Reward/EarnedRewardQuery";
import MyDate from "src/common/Date";
import PenaltyQuery from "src/Models/Penalty/PenaltyQuery";



export default class EarnedRewardLogic {
    id: string;
    earned?: EarnedReward;
    constructor(id: string) {
        this.id = id;
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

    /**
     * Claims the specified reward and creates a clone
     * of its details in the Claimed Rewards table so that 
     * it can be accessed by the user.
     */
    claimReward = async (rewardId: string) => {
        const earned = await this._fetchEarned();

        if(earned) {
            const reward = await new RewardQuery().get(rewardId);

            if(reward) {
                new ClaimedRewardQuery().create({
                    title: reward.title,
                    details: reward.details,
                    claimedDate: new MyDate().toDate(),
                    earnedId: this.id,
                });
            }
        }

    }

    claimPenalty = async (penaltyId: string) => {
        const earned = await this._fetchEarned();

        if(earned) {
            const penalty = await new PenaltyQuery().get(penaltyId);

            if(penalty) {
                new ClaimedRewardQuery().create({
                    title: penalty.title,
                    details: penalty.details,
                    claimedDate: new MyDate().toDate(),
                    earnedId: this.id,
                });
            }
        }
    }
}