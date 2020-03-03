
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Item from "src/Components/Lists/Items/base/Item";
import { ListItem } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";

interface Props {
    item: Recur
    accessibilityLabel: string
    navigation: any
}

interface State {

}

interface Recur {
    id: string;
    type: "daily" | "weekly" | "monthly";
    title: string;
    active: boolean;
}

export default class RecurListItem extends Item<Props, State, Recur> {
    constructor(props: Props) {
        super(props);
    }
    
    render = () => {
        const {id, title, active, type} = this.props.item

        return (
            <ListItem
                navigation={this.props.navigation}
                params={{id: id}}
                destination={"Recur"}
                accessibilityLabel={this.props.accessibilityLabel}
                text={title}
                subtext={ type }
                number={0}
                key={id}
                type={"recur"}
            >
            </ListItem>
        )
    }
}

export {
    RecurListItem,
    Recur,
}