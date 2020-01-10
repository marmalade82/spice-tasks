
import React from "react";

import {
    ConnectedTaskListItem
} from "src/ConnectedComponents/Lists/Task/TaskListItem";

import Goal from "src/Models/Goal/Goal";
import withObservables from "@nozbe/with-observables";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
    Task
} from "src/Models/Task/Task";
import TaskQuery from "src/Models/Task/TaskQuery";
import List from "src/Components/Lists/base/List";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";

interface Props {
    tasks: Task[];
    navigation: any;
}

const AdaptedTaskList: React.FunctionComponent<Props> = (props: Props) => {
    
    const renderTask = (item: Task) => {
        return (
            <ClickNavigation
                navigation={props.navigation}
                parameters={{id: item.id}}            
                destination={'AddTask'}
            >
                    <ConnectedTaskListItem
                        task={item}
                    ></ConnectedTaskListItem>
            </ClickNavigation>
        )
    }

    return (
        <List
            items={props.tasks} 
            renderItem={renderTask}
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
        tasks: new TaskQuery().queryAll().observe()
    }
});

export const ConnectedTaskList = enhance(AdaptedTaskList);
