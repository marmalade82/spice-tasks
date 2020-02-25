
import React from "react";

import {
    EarnedRewardListItem,
    EarnedReward as IEarnedReward,
} from "src/Components/Lists/Items/EarnedRewardListItem";

import EarnedReward from "src/Models/Reward/EarnedReward";
import withObservables from "@nozbe/with-observables";


interface Props {
    earned: EarnedReward
    navigation: any;
}

const AdaptedEarnedRewardListItem: React.FunctionComponent<Props> = function(props: Props) {
    const earned = props.earned;
    const mappedEarnedReward: IEarnedReward = {
        id: earned.id,
        earnedDate: earned.earnedDate,
        goalId: earned.goalId,
        type: earned.type,
        title: earned.title,
        details: earned.details,
    }

    return (
        <EarnedRewardListItem
            item={mappedEarnedReward}
            accessibilityLabel={"earned-reward-list-item"}
            navigation={props.navigation}
        ></EarnedRewardListItem>
    );
}


interface InputProps {
    earned: EarnedReward
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

export const ConnectedEarnedRewardListItem = enhance(AdaptedEarnedRewardListItem);