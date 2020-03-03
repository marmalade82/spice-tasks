
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { 
    ColumnView, RowView,
} from "src/Components/Basic/Basic";
import Item from "src/Components/Lists/Items/base/Item";
import { RewardType } from "src/Models/Reward/RewardLogic";
import { ListItem } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";

interface EarnedReward {
    id: string;
    earnedDate: Date;
    type: Exclude<RewardType, "none">;
    goalId: string;
    title: string;
    details: string;
}

interface Props {
    item: EarnedReward;
    accessibilityLabel: string
    navigation: any;
}

interface State {

}


export default class EarnedRewardListItem extends Item<Props, State, EarnedReward> {
    constructor(props: Props) {
        super(props);
    }
    
    render = () => {
        const { id, earnedDate, type, goalId, title, details } = this.props.item

        return (
            <ListItem
                navigation={this.props.navigation}
                params={{id: id}}
                destination={"EarnedReward"}
                text={title}
                subtext={new MyDate(earnedDate).format("MMM Do")}
                number={0}
                key={id}
                accessibilityLabel={this.props.accessibilityLabel}
                type={"earned_reward"}
            ></ListItem>
        )
    }
}

export {
    EarnedRewardListItem,
    EarnedReward,
}