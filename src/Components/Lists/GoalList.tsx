

import React from "react";
import { 
    View, StyleSheet, TextInput, 
    FlatList, Text, TouchableOpacity,
} from "react-native";
import { isTemplateElement } from "@babel/types";


interface Props {
    goals: Goal[]
    navigation: any
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
                <TouchableOpacity 
                    style={[localStyle.row]}
                    onPress={() => {
                        this.props.navigation.navigate('AddGoal', {
                            id: row.item.id
                        });
                    }}
                >
                    <View style={localStyle.title}>
                        <Text>{row.item.title}</Text>
                    </View>
                    <View style={localStyle.details}>
                        <Text>{row.item.due_date.toString()}</Text>
                        <Text>{row.item.type}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    render = () => {
        return (
            <View style={[localStyle.container]}>
                <FlatList
                    data={ this.props.goals }
                    renderItem={this.renderGoal}
                    keyExtractor={(goal) => { return goal.id }}
                ></FlatList>
                <View style={[localStyle.list]}>
                </View>
            </View>
        );
    }
}

/**
 * 
 */

export {
    GoalList,
    Goal as IGoal,
}