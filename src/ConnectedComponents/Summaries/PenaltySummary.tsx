
import React from "react";


import withObservables from "@nozbe/with-observables";
import {
    Penalty
} from "src/Models/Penalty/Penalty";
import PenaltySummary, {OnChoice} from "src/Components/Summaries/PenaltySummary";
import { StyleProp, ViewStyle } from "react-native";



interface Props {
    penalty: Penalty,
    style: StyleProp<ViewStyle>;
    navigation: any;
    onChoice: OnChoice;
}

const AdaptedPenaltySummary: React.FunctionComponent<Props> = (props: Props) => {
    const penalty = props.penalty;

    return (
        <PenaltySummary
            style={props.style}
            expireDate={penalty.expireDate}
            navigation={props.navigation}
            title={penalty.title}
            details={penalty.details}
            onChoice={props.onChoice}
        >
        </PenaltySummary>
    )

}

interface InputProps {
    penalty: Penalty
    style: StyleProp<ViewStyle>
    navigation: any;
    onChoice: OnChoice
}

/**
 * This function ensures that the component is connected to the database
 */

const enhance = withObservables([], (props: InputProps) => {
    return {
        penalty: props.penalty.observe(),
    }
});

export const ConnectedPenaltySummary = enhance(AdaptedPenaltySummary);
