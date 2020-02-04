
import React from "react";

import {
    RewardListItem,
    Reward as IReward,
} from "src/Components/Lists/Items/RewardListItem";

import Reward from "src/Models/Reward/Reward";
import withObservables from "@nozbe/with-observables";

interface Props {
    reward: Reward
    navigation: any
}

const AdaptedRewardListItem: React.FunctionComponent<Props> = function(props: Props) {
    const reward = props.reward;
    const mappedReward: IReward = {
        id: reward.id,
        expire_date: reward.expireDate,
        title: reward.title,
    }

    return (
        <RewardListItem
            item={mappedReward}
            accessibilityLabel={"reward-list-item"}
            navigation={props.navigation}
        ></RewardListItem>
    );
}

interface InputProps {
    reward: Reward
    navigation: any
}

/**
 * This function connects the component with the database
 */
const enhance = withObservables(['reward'], (props: InputProps) => {
    return {
        reward: props.reward
    }
});

export const ConnectedRewardListItem = enhance(AdaptedRewardListItem);