
import React from "react";

import {
    EarnedPenaltyListItem,
    EarnedPenalty as IEarnedPenalty,
} from "src/Components/Lists/Items/EarnedPenaltyListItem";

import EarnedPenalty from "src/Models/Penalty/EarnedPenalty";
import withObservables from "@nozbe/with-observables";


interface Props {
    earned: EarnedPenalty
    navigation: any;
}

const AdaptedEarnedPenaltyListItem: React.FunctionComponent<Props> = function(props: Props) {
    const earned = props.earned;
    const mappedEarnedPenalty: IEarnedPenalty = {
        id: earned.id,
        earnedDate: earned.earnedDate,
        goalId: earned.goalId,
        type: earned.type,
        title: earned.title,
        details: earned.details,
    }

    return (
        <EarnedPenaltyListItem
            item={mappedEarnedPenalty}
            accessibilityLabel={"earned-penalty-list-item"}
            navigation={props.navigation}
        ></EarnedPenaltyListItem>
    );
}


interface InputProps {
    earned: EarnedPenalty
    navigation: any;
}

/**
 * This function connects the component with the database
 */
const enhance = withObservables(['earned'], (props: InputProps) => {
    return {
        earned: props.earned
    }
});

export const ConnectedEarnedPenaltyListItem = enhance(AdaptedEarnedPenaltyListItem);