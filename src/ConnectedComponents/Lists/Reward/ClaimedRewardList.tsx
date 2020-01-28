
import React from "react";


import ClaimedReward from "src/Models/Reward/ClaimedReward";
import withObservables from "@nozbe/with-observables";

import ClaimedRewardQuery from "src/Models/Reward/ClaimedRewardQuery";
import List from "src/Components/Lists/base/List";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";
import { ConnectedClaimedRewardListItem } from "src/ConnectedComponents/Lists/Reward/ClaimedRewardListItem";

interface Props {
    claimed: ClaimedReward[];
    navigation: any;
}

const AdaptedClaimedRewardList: React.FunctionComponent<Props> = (props: Props) => {
    
    const renderClaimedReward = (item: ClaimedReward) => {
        return (
            <ClickNavigation
                navigation={props.navigation}
                parameters={{
                    id: item.id
                }}
                destination={"ClaimedReward"}
                navType={"navigate"}
            >
                <ConnectedClaimedRewardListItem
                    claimed={item}
                >
                </ConnectedClaimedRewardListItem>
            </ClickNavigation>
        )
    }

    return (
        <List
            items={props.claimed} 
            renderItem={renderClaimedReward}
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
        claimed: new ClaimedRewardQuery().queryAll().observe()
    }
});

export const ConnectedClaimedRewardList = enhance(AdaptedClaimedRewardList);