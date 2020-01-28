
import React from "react";

import {
    ClaimedRewardListItem,
    ClaimedReward as IClaimedReward,
} from "src/Components/Lists/Items/ClaimedRewardListItem";

import ClaimedReward from "src/Models/Reward/ClaimedReward";
import withObservables from "@nozbe/with-observables";


interface Props {
    claimed: ClaimedReward
}

const AdaptedClaimedRewardListItem: React.FunctionComponent<Props> = function(props: Props) {
    const claimed = props.claimed;
    const mappedClaimedReward: IClaimedReward = {
        id: claimed.id,
        claimedDate: claimed.claimedDate,
        earnedId: claimed.earnedId,
        completedDate: claimed.completedDate,
        type: claimed.type,
    }

    return (
        <ClaimedRewardListItem
            item={mappedClaimedReward}
            accessibilityLabel={"claimed-reward-list-item"}
        ></ClaimedRewardListItem>
    );
}


interface InputProps {
    claimed: ClaimedReward
}

/**
 * This function connects the component with the database
 */
const enhance = withObservables(['claimed'], (props: InputProps) => {
    return {
        claimed: props.claimed
    }
});

export const ConnectedClaimedRewardListItem = enhance(AdaptedClaimedRewardListItem);