
import React from "react";

import {
    TaskListItem,
    Task as ITask,
} from "src/Components/Lists/Items/TaskListItem";

import Task from "src/Models/Task/Task";
import withObservables from "@nozbe/with-observables";
import {Text} from "react-native";

interface Props {
    task: Task
    navigation: any
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
        ></TaskListItem>
    );
}

interface InputProps extends Props {
    task: Task,
    navigation: any,
}

const enhance = withObservables(['task'], (props: InputProps) => {
    return {
        goal: props.task
    }
});

export const ConnectedTaskListItem = enhance(AdaptedTaskListItem);