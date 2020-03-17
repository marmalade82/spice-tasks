
import React from "react";

import {
    EarnedPenaltyListItem,
    EarnedPenalty as IEarnedPenalty,
    OnEarnedPenaltyAction,
} from "src/Components/Lists/Items/EarnedPenaltyListItem";

import EarnedPenalty from "src/Models/Penalty/EarnedPenalty";
import withObservables from "@nozbe/with-observables";
import { Navigation, ScreenParams } from "src/common/Navigator";


interface Props {
    earned: EarnedPenalty
    navigation: Navigation<ScreenParams>;
    onEarnedPenaltyAction: OnEarnedPenaltyAction;
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
            onAction={props.onEarnedPenaltyAction}
        ></EarnedPenaltyListItem>
    );
}


interface InputProps extends Props {

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