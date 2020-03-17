
import React from "react";

import {
    PenaltyListItem,
    Penalty as IPenalty,
} from "src/Components/Lists/Items/PenaltyListItem";

import Penalty from "src/Models/Penalty/Penalty";
import withObservables from "@nozbe/with-observables";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props {
    penalty: Penalty
    navigation: Navigation<ScreenParams>,
}

const AdaptedPenaltyListItem: React.FunctionComponent<Props> = function(props: Props) {
    const penalty = props.penalty;
    const mappedPenalty: IPenalty = {
        id: penalty.id,
        expire_date: penalty.expireDate,
        title: penalty.title,
    }

    return (
        <PenaltyListItem
            item={mappedPenalty}
            accessibilityLabel={"penalty-list-item"}
            navigation={props.navigation}
        ></PenaltyListItem>
    );
}

interface InputProps extends Props {

}

/**
 * This function connects the component with the database
 */
const enhance = withObservables(['penalty'], (props: InputProps) => {
    return {
        penalty: props.penalty
    }
});

export const ConnectedPenaltyListItem = enhance(AdaptedPenaltyListItem);