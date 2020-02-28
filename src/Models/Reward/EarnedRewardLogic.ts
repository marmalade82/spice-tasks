import RewardQuery from "src/Models/Reward/RewardQuery"
import ClaimedRewardQuery from "src/Models/Reward/ClaimedRewardQuery";
import EarnedRewardQuery, { EarnedReward } from "src/Models/Reward/EarnedRewardQuery";
import MyDate from "src/common/Date";
import PenaltyQuery from "src/Models/Penalty/PenaltyQuery";
import { RewardTypes } from "./RewardLogic";
import { isBuffer } from "util";


export default class EarnedRewardLogic {
    id: string;
    earned?: EarnedReward;
    constructor(id: string) {
        this.id = id;
    }

    static earnSpecific = async (rewardId: string, goalId: string) => {
        const reward = await new RewardQuery().get(rewardId);
        if(reward) {
            const title = reward.title;
            const details = reward.details;
            void new EarnedRewardQuery().create({
                title: title,
                details: details,
                goalId: goalId,
                type: RewardTypes.SPECIFIC
            });
        }
    }

    use = async() => {
        const earned = await new EarnedRewardQuery().get(this.id);
        if(earned) {
            await new EarnedRewardQuery().update(earned, {
                active: false,
            })
        }
    }

    fetchEarned = async () => {
        if(this.earned) {
            debugger;
        } else {
            debugger;
            const earned = await new EarnedRewardQuery().get(this.id);
            if(earned) {
                this.earned = earned;
            } else {
                this.earned = undefined;
            }
        }
        return this.earned;
    }

    /**
     * Claims the specified reward and creates a clone
     * of its details in the Claimed Rewards table so that 
     * it can be accessed by the user.
     */
    claimReward = async (rewardId: string) => {
        const earned = await this.fetchEarned();
        debugger;
        if(earned) {
            const reward = await new RewardQuery().get(rewardId);
            debugger;
            if(reward) {
                await new ClaimedRewardQuery().create({
                    title: reward.title,
                    details: reward.details,
                    claimedDate: new MyDate().toDate(),
                    type: "reward",
                    earnedId: this.id,
                });
            }
        }

    }

    claimPenalty = async (penaltyId: string) => {
        const earned = await this.fetchEarned();

        if(earned) {
            const penalty = await new PenaltyQuery().get(penaltyId);

            if(penalty) {
                await new ClaimedRewardQuery().create({
                    title: penalty.title,
                    details: penalty.details,
                    claimedDate: new MyDate().toDate(),
                    type: "penalty",
                    earnedId: this.id,
                });
            }
        }
    }
}