
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
import { Query } from "@nozbe/watermelondb";

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
                destination={'Task'}
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
    navigation: any;
    type: "all" | "parent-active" | "parent-all" | "active";
    parentId: string | false;  // shows all tasks that have this parent
}

/**
 * This function ensures that the component is connected to the database
 */

const enhance = withObservables(['type'], (props: InputProps) => {
    if(props.type === "active") {
        return {
            tasks: new TaskQuery().queryActiveTasks().observe()
        }
    } else if(props.type === "parent-active" && props.parentId) {
        return {
            tasks: new TaskQuery().queryActiveHasParent(props.parentId).observe(),
        }
    } else {
        return {
            tasks: new TaskQuery().queryAll().observe(),
        }
    }
});

export const ConnectedTaskList = enhance(AdaptedTaskList);
