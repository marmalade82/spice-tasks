
import React from "react";

import {
    ConnectedTaskListItem
} from "src/ConnectedComponents/Lists/Task/TaskListItem";

import withObservables from "@nozbe/with-observables";
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
 * This function ensures that the component is connected to the database
 */

const enhance = withObservables([], (_props: InputProps) => {
    return {
        tasks: new TaskQuery().queryAll().observe()
    }
});

export const ConnectedTaskList = enhance(AdaptedTaskList);