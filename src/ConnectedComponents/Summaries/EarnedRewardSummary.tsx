
import React from "react";


import withObservables from "@nozbe/with-observables";
import {
    EarnedReward
} from "src/Models/Reward/EarnedReward";
import EarnedRewardSummary from "src/Components/Summaries/EarnedRewardSummary";
import { StyleProp, ViewStyle } from "react-native";
import Goal from "src/Models/Goal/Goal";



interface Props {
    earned: EarnedReward,
    goal: Goal,
    style: StyleProp<ViewStyle>
}

const AdaptedEarnedRewardSummary: React.FunctionComponent<Props> = (props: Props) => {
    const earned = props.earned;
    const goal = props.goal;

    return (
        <EarnedRewardSummary
            style={props.style}
            rewardType={earned.type}
            goalName={goal.title}
            earnedDate={earned.earnedDate}
        >
        </EarnedRewardSummary>
    )

}

interface InputProps {
    earned: EarnedReward
    goal: Goal,
    style: StyleProp<ViewStyle>
}

/**
 * This function ensures that the component is connected to the database
 */

const enhance = withObservables([], (props: InputProps) => {
    return {
        earned: props.earned.observe(),
        goal: props.goal.observe(),
    }
});

export const ConnectedEarnedRewardSummary = enhance(AdaptedEarnedRewardSummary);
