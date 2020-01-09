import React from "react";

import {
    GoalList,
    IGoal,
} from "src/Components/Lists/GoalList";

import {
    ConnectedGoalListItem
} from "src/ConnectedComponents/Lists/Items/GoalListItem";

import Goal from "src/Models/Goal/Goal";
import withObservables from "@nozbe/with-observables";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import GoalQuery from "src/Models/Goal/GoalQuery";
import List from "src/Components/Lists/base/List";

interface Props {
    goals: Goal[];
    navigation: any;
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

const AdaptedGoalList: React.FunctionComponent<Props> = (props: Props) => {
    const mappedGoals: IGoal[] = props.goals.map((goal: Goal) => {
        const g: IGoal = {
            id: goal.id,
            title: goal.title,
            due_date: goal.dueDate,
            type: goal.goalType, 
        };

        return g;
    });
    
    const renderGoal = (item: Goal) => {
        return (
            <View style={[localStyle.row]}>
                <TouchableOpacity 
                    style={[localStyle.row]}
                    onPress={() => {
                        props.navigation.navigate('AddGoal', {
                            id: item.id
                        });
                    }}
                >
                    <ConnectedGoalListItem
                        goal={item}
                    ></ConnectedGoalListItem>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <List
            items={props.goals} 
            renderItem={renderGoal}
        >
        </List>
    )
}

interface InputProps {
    navigation: any
}

/**
 * This function ensures that the enhanced component will always take its goals from the full list of goals. We may want to change this in the 
 * future based on props
 */

const enhance = withObservables([], (_props: InputProps) => {
    return {
        goals: GoalQuery.queryAll().observe()
    }
});

export const ConnectedGoalList = enhance(AdaptedGoalList);
