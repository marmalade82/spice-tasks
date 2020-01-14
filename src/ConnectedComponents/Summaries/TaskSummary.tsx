
import React from "react";


import withObservables from "@nozbe/with-observables";
import {
    Task
} from "src/Models/Task/Task";
import TaskSummary from "src/Components/Summaries/TaskSummary";

interface Props {
    task: Task,
}

const AdaptedTaskSummary: React.FunctionComponent<Props> = (props: Props) => {
    const task = props.task;
    const mappedTask = {
        title: task.title,
        due_date: task.dueDate, 
    }

    return (
        <TaskSummary
            task={mappedTask}
        >
        </TaskSummary>
    )

}


interface InputProps {
    task: Task
}

/**
 * This function ensures that the component is connected to the database
 */

const enhance = withObservables(['task'], (props: InputProps) => {
    return {
        task: props.task.observe()
    }
});

export const ConnectedTaskSummary = enhance(AdaptedTaskSummary);