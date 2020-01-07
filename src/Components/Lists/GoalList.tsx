

import React from "react";
import { View, StyleSheet, TextInput, FlatList, Text } from "react-native";


interface Props {
    goals: Goal[]
}

interface State {
    title: string;
}

interface Goal {
    id: string;
    title: string;
    due_date: Date;
    type: string;
}


const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "lightblue",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "95%",
    },
    row: {
        flex: 1,
        backgroundColor: "pink",
        width: "100%",
    },
    list: {
        flex: 1,
        backgroundColor: "lightgreen",
        width: "95%",
    },
    title: {

    },
    details: {

    },
});

/**
 * General component for showing any list of goals
 */
export default class GoalList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            title: "yo",
        }
    }


    renderGoal = (row: { item: Goal}) => {
        return (
            <View style={[localStyle.row]}>
                <View style={localStyle.title}>
                    <Text>{row.item.title}</Text>
                </View>
                <View style={localStyle.details}>
                    <Text>{row.item.due_date}</Text>
                    <Text>{row.item.type}</Text>
                </View>
            </View>
        )
    }


    render = () => {
        return (
            <View style={[localStyle.container]}>

                <View style={[localStyle.list]}>
                    <FlatList
                        data={ this.props.goals }
                        renderItem={this.renderGoal}
                        keyExtractor={(goal) => { return goal.id }}
                    ></FlatList>
                </View>
            </View>
        );
    }
}

export {
    GoalList,
    Goal as IGoal,
}