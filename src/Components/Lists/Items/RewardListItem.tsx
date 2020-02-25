import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Item from "src/Components/Lists/Items/base/Item";
import { ListItem } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";

interface Props {
    item: Reward
    accessibilityLabel: string
    navigation: any
}

interface State {

}

interface Reward {
    id: string;
    title: string;
    expire_date: Date;
}

export default class RewardListItem extends Item<Props, State, Reward> {
    constructor(props: Props) {
        super(props);
    }
    
    render = () => {
        const {id, title, expire_date} = this.props.item

        return (
            <ListItem
                navigation={this.props.navigation}
                params={{id: id}}
                destination={"AddReward"}
                text={title}
                subtext={new MyDate(expire_date).format("MMM Do")}
                number={0}
                key={id}
                accessibilityLabel={this.props.accessibilityLabel}
            ></ListItem>
        )
    }
}

export {
    RewardListItem,
    Reward,
}