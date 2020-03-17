
import React from "react";


import Reward from "src/Models/Reward/Reward";
import withObservables from "@nozbe/with-observables";

import RewardQuery from "src/Models/Reward/RewardQuery";
import List from "src/Components/Lists/base/List";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";
import { ConnectedRewardListItem } from "src/ConnectedComponents/Lists/Reward/RewardListItem";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props {
    rewards: Reward[];
    navigation: Navigation<ScreenParams>;
}

const AdaptedRewardList: React.FunctionComponent<Props> = (props: Props) => {
    
    const renderReward = (item: Reward) => {
        return (
            <ConnectedRewardListItem
                reward={item}
                navigation={props.navigation}
            >
            </ConnectedRewardListItem>
        )
    }

    return (
        <List
            items={props.rewards} 
            renderItem={renderReward}
        >
        </List>
    )
}


interface InputProps extends Omit<Props, "rewards"> {
}

/**
 * Connects the list with the database
 */
const enhance = withObservables([], (_props: InputProps) => {
    return {
        rewards: new RewardQuery().queryAll().observe()
    }
});

export const ConnectedRewardList = enhance(AdaptedRewardList);
