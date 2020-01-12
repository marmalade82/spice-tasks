
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Style from "src/Style/Style";
import {
    ColumnView, RowView,
} from "src/Components/Basic/Basic";

interface Props {
    goal: Goal
}

interface State {

}

interface Goal {
    title: string;
    due_date: string;
}

const localStyle = StyleSheet.create({
    container: {
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    space: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})


export default class GoalSummary extends React.Component<Props, State> {


    render = () => {
        return (
            <ColumnView
                style={ [Style.yellowBg] }
            >
                <RowView style={[localStyle.row]}>
                    <ColumnView style={[localStyle.title]}>
                        <Text>{this.props.goal.title}</Text>
                    </ColumnView>
                    <ColumnView style={[localStyle.space]}>
                        <Text>{this.props.goal.due_date.toString()}</Text>
                    </ColumnView>
                </RowView>

            </ColumnView>
        );
    }
}

export {
    GoalSummary
}