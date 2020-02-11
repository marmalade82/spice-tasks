
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

interface Props {
    tasks: Task[];
    navigation: any;
}

const AdaptedTaskList: React.FunctionComponent<Props> = (props: Props) => {
    
    const renderTask = (item: Task) => {
        return (
                    <ConnectedTaskListItem
                        task={item}
                        navigation={props.navigation}
                    ></ConnectedTaskListItem>
        );
        
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
    type: 
        "all" | "parent-active" | "parent-inactive" | 
        "parent-all" | "active" | "active-due-soon-today" |
        "completed-today" | "in-progress-but-not-due-today" |
        "overdue";
    parentId: string  // shows all tasks that have this parent
}

/**
 * This function ensures that the component is connected to the database
 */

const enhance = withObservables(['type'], (props: InputProps) => {
    switch(props.type) {
        case "active": {
            return {
                tasks: new TaskQuery().queryActiveTasks().observe()
            }
        } break;
        case "parent-active": {
            return {
                tasks: new TaskQuery().queryActiveHasParent(props.parentId).observe(),
            }
        } break;
        case "parent-inactive": {
            return {
                tasks: new TaskQuery().queryInactiveHasParent(props.parentId).observe(),
            }
        } break;
        case "active-due-soon-today": {
            return {
                tasks: new TaskQuery().queryActiveAndDueSoonToday().observe()
            }
        } break;
        case "completed-today" : {
            return {
                tasks: new TaskQuery().queryCompletedToday().observe()
            }
        } break;
        case "in-progress-but-not-due-today": {
            return {
                tasks: new TaskQuery().queryActiveAndStartedButNotDue().observe()
            }
        } break;
        case "overdue": {
            return {
                tasks: new TaskQuery().queryActiveAndOverdue().observe()
            }
        } break;
        default: {
            return {
                tasks: new TaskQuery().queryAll().observe(),
            }
        }
    }
});

export const ConnectedTaskList = enhance(AdaptedTaskList);
