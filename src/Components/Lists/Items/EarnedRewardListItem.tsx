
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { 
    ColumnView, RowView,
} from "src/Components/Basic/Basic";
import Item from "src/Components/Lists/Items/base/Item";

interface EarnedReward {
    id: string;
    earnedDate: Date;
    type: "two_dice";
    goalId: string;
}

interface Props {
    item: EarnedReward;
    accessibilityLabel: string
}

interface State {

}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "pink",
        borderColor: "black",
        borderWidth: 1,
        flexDirection: 'column'
    },
    title: {
        paddingTop: "2%",
        paddingBottom: "2%",
        paddingLeft: "2%",
        paddingRight: "2%",
    },
    details: {
        paddingTop: "2%",
        paddingLeft: "2%",
        paddingRight: "2%",
        paddingBottom: "2%",
        backgroundColor: "white",
        flexWrap: 'wrap',
    },
});


export default class EarnedRewardListItem extends Item<Props, State, EarnedReward> {
    constructor(props: Props) {
        super(props);
    }
    
    render = () => {
        const item = this.props.item

        return (
            <ColumnView style={[]} accessibilityLabel={this.props.accessibilityLabel}>
                <RowView style={localStyle.title}>
                    <Text>{item.type + " : " + item.id}</Text>
                </RowView>
                <RowView style={localStyle.details}>
                    <Text>{item.earnedDate.toString()}</Text>
                    <Text>{item.goalId}</Text>
                </RowView>
            </ColumnView>
        );
    }
}

export {
    EarnedRewardListItem,
    EarnedReward,
}