
import React from "react";


import withObservables from "@nozbe/with-observables";
import {
    EarnedReward
} from "src/Models/Reward/EarnedReward";
import EarnedRewardSummary, {OnChoice} from "src/Components/Summaries/EarnedRewardSummary";
import { StyleProp, ViewStyle } from "react-native";
import Goal from "src/Models/Goal/Goal";



interface Props {
    earned: EarnedReward,
    goal: Goal,
    style: StyleProp<ViewStyle>;
    navigation: any;
    onChoice: OnChoice;
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
            navigation={props.navigation}
            title={earned.title}
            details={earned.details}
            onChoice={props.onChoice}
            active={earned.active}
        >
        </EarnedRewardSummary>
    )

}

interface InputProps {
    earned: EarnedReward
    goal: Goal,
    style: StyleProp<ViewStyle>
    navigation: any;
    onChoice: OnChoice
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
