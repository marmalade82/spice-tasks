
import React from "react";


import EarnedReward from "src/Models/Reward/EarnedReward";
import withObservables from "@nozbe/with-observables";

import EarnedRewardQuery from "src/Models/Reward/EarnedRewardQuery";
import List from "src/Components/Lists/base/List";
import { ConnectedEarnedRewardListItem } from "src/ConnectedComponents/Lists/Reward/EarnedRewardListItem";

interface Props {
    earned: EarnedReward[];
    navigation: any;
}

const AdaptedEarnedRewardList: React.FunctionComponent<Props> = (props: Props) => {
    
    const renderEarnedReward = (item: EarnedReward) => {
        return (
            <ConnectedEarnedRewardListItem
                earned={item}
                navigation={props.navigation}
            >
            </ConnectedEarnedRewardListItem>
        )
    }

    return (
        <List
            items={props.earned} 
            renderItem={renderEarnedReward}
        >
        </List>
    )
}

interface InputProps {
    navigation: any
}

/**
 * Connects the list with the database
 */
const enhance = withObservables([], (_props: InputProps) => {
    return {
        earned: new EarnedRewardQuery().queryAll().observe()
    }
});

export const ConnectedEarnedRewardList = enhance(AdaptedEarnedRewardList);