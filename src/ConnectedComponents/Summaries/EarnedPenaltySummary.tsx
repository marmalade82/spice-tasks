
import React from "react";


import withObservables from "@nozbe/with-observables";
import {
    EarnedPenalty
} from "src/Models/Penalty/EarnedPenalty";
import EarnedPenaltySummary, {OnChoice} from "src/Components/Summaries/EarnedPenaltySummary";
import { StyleProp, ViewStyle } from "react-native";
import Goal from "src/Models/Goal/Goal";



interface Props {
    earned: EarnedPenalty,
    goal: Goal,
    style: StyleProp<ViewStyle>;
    navigation: any;
    onChoice: OnChoice;
}

const AdaptedEarnedPenaltySummary: React.FunctionComponent<Props> = (props: Props) => {
    const earned = props.earned;
    const goal = props.goal;

    return (
        <EarnedPenaltySummary
            style={props.style}
            penaltyType={earned.type}
            goalName={goal.title}
            earnedDate={earned.earnedDate}
            navigation={props.navigation}
            title={earned.title}
            details={earned.details}
            onChoice={props.onChoice}
            active={earned.active}
        >
        </EarnedPenaltySummary>
    )

}

interface InputProps {
    earned: EarnedPenalty
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

export const ConnectedEarnedPenaltySummary = enhance(AdaptedEarnedPenaltySummary);
