

import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { 
    ColumnView, RowView,
} from "src/Components/Basic/Basic";
import Item from "src/Components/Lists/Items/base/Item";
import { PenaltyTypes } from "src/Models/Penalty/PenaltyLogic";
import { ListItem } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";

interface EarnedPenalty {
    id: string;
    earnedDate: Date;
    type: Exclude<PenaltyTypes, "none">;
    goalId: string;
    title: string;
    details: string;
}

interface Props {
    item: EarnedPenalty;
    accessibilityLabel: string
    navigation: any;
}

interface State {

}

export default class EarnedPenaltyListItem extends Item<Props, State, EarnedPenalty> {
    constructor(props: Props) {
        super(props);
    }
    
    render = () => {
        const { id, earnedDate, type, goalId, title, details } = this.props.item

        return (
            <ListItem
                navigation={this.props.navigation}
                params={{id: id}}
                destination={"EarnedPenalty"}
                text={title}
                subtext={new MyDate(earnedDate).format("MMM Do")}
                number={0}
                key={id}
                accessibilityLabel={this.props.accessibilityLabel}
                type={"earned_penalty"}
            ></ListItem>
        )
    }
}

export {
    EarnedPenaltyListItem,
    EarnedPenalty,
}