
import React from "react";

import {
    TaskListItem,
    Task as ITask,
    OnTaskAction,
} from "src/Components/Lists/Items/TaskListItem";

import Task from "src/Models/Task/Task";
import withObservables from "@nozbe/with-observables";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props {
    task: Task
    navigation: Navigation<ScreenParams>
    onTaskAction: OnTaskAction;
}

const AdaptedTaskListItem: React.FunctionComponent<Props> = function(props: Props) {
    const task = props.task;
    const mappedTask: ITask = {
        id: task.id,
        due_date: task.dueDate,
        start_date: task.startDate,
        title: task.title,
    }

    return (
        <TaskListItem
            item={mappedTask}
            accessibilityLabel={"task-list-item"}
            navigation={props.navigation}
            onTaskAction={props.onTaskAction}
        ></TaskListItem>
    );
}

interface InputProps extends Props {

}

const enhance = withObservables(['task'], (props: InputProps) => {
    return {
        goal: props.task
    }
});

export const ConnectedTaskListItem = enhance(AdaptedTaskListItem);