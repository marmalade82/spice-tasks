
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Item from "src/Components/Lists/Items/base/Item";
import { ListItem, ModalIconButton, ModalRow } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";

export interface Props {
    item: StreakCycle,
    accessibilityLabel: string
    navigation: any
}

export interface StreakCycle {
    start: Date,
    end: Date,
    id: string,
}

interface State {
    showMore: boolean;
}


export class StreakCycleListItem extends Item<Props, State, StreakCycle> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showMore: false,
        }
    }
    
    render = () => {
        const {id, start, end} = this.props.item

        return (
            <ListItem
                navigation={this.props.navigation}
                params={{id: id}}
                destination={"StreakCycle"}
                accessibilityLabel={this.props.accessibilityLabel}
                text={`${new MyDate(start).format("MMM Do")} to ${new MyDate(end).format("MMM Do")}`}
                subtext={ "" }
                number={0}
                key={id}
                type={"goal"}
                footerIcons={undefined}
            >
            </ListItem>
        )
    }
}
export default StreakCycleListItem;