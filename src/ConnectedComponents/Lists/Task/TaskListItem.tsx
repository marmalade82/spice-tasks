
import React from "react";

import {
    TaskListItem,
    Task as ITask,
} from "src/Components/Lists/Items/TaskListItem";

import Task from "src/Models/Task/Task";
import withObservables from "@nozbe/with-observables";

interface Props {
    task: Task
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
        ></TaskListItem>
    );
}

interface InputProps {
    task: Task
}

const enhance = withObservables(['task'], (props: InputProps) => {
    return {
        goal: props.task
    }
});

export const ConnectedTaskListItem = enhance(AdaptedTaskListItem);