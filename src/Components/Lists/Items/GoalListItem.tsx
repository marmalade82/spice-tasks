import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Item from "src/Components/Lists/Items/base/Item";
import { ListItem } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";

interface Props {
    item: Goal
    accessibilityLabel: string
    navigation: any
}

interface State {

}

interface Goal {
    id: string;
    title: string;
    due_date: Date;
    type: string;
}

export default class GoalListItem extends Item<Props, State, Goal> {
    constructor(props: Props) {
        super(props);
    }
    
    render = () => {
        const {id, title, due_date, type} = this.props.item

        return (
            <ListItem
                navigation={this.props.navigation}
                params={{id: id}}
                destination={"Goal"}
                accessibilityLabel={this.props.accessibilityLabel}
                text={title}
                subtext={ new MyDate(due_date).format("MMM Do")}
                number={0}
                key={id}
            >
            </ListItem>
        )
/*
        return (
            <View style={[localStyle.container]} accessibilityLabel={this.props.accessibilityLabel}>
                <View style={localStyle.title}>
                    <Text>{item.title + " : " + item.id}</Text>
                </View>
                <View style={localStyle.details}>
                    <Text>{item.due_date.toString()}</Text>
                    <Text>{item.type}</Text>
                </View>
            </View>
        );*/
    }
}

export {
    GoalListItem,
    Goal,
}