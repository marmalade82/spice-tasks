

import React from "react";
import { 
    View, StyleSheet, TextInput, 
    FlatList, Text, TouchableOpacity,
} from "react-native";
import {
    GoalListItem,
    Goal,
} from "src/Components/Lists/Items/GoalListItem";
import List from "src/Components/Lists/base/List";


interface Props {
    goals: Goal[]
    navigation: any
}

interface State {
    title: string;
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


    renderGoal = (item: Goal) => {
        return (
            <View style={[localStyle.row]}>
                <TouchableOpacity 
                    style={[localStyle.row]}
                    onPress={() => {
                        this.props.navigation.navigate('AddGoal', {
                            id: item.id
                        });
                    }}
                >
                    <GoalListItem
                        item={item}
                        accessibilityLabel={"goal-list-item"}
                        navigation={this.props.navigation}
                    ></GoalListItem>
                </TouchableOpacity>
            </View>
        )
    }

    render = () => {
        return (
            <List
                items={this.props.goals}
                renderItem={this.renderGoal}
            ></List>
        );
    }
}

export {
    GoalList,
    Goal as IGoal,
}