
import React from "react";


import withObservables from "@nozbe/with-observables";
import {
    Task
} from "src/Models/Task/Task";
import TaskSummary from "src/Components/Summaries/TaskSummary";

interface Props {
    task: Task,
    navigation: any,
    onModalChoice: (s: "complete" | "delete") => void;
}

const AdaptedTaskSummary: React.FunctionComponent<Props> = (props: Props) => {
    const task = props.task;
    const mappedTask = {
        title: task.title,
        start_date: task.startDate,
        due_date: task.dueDate, 
        instructions: task.instructions,
        active: task.active, 
    }

    return (
        <TaskSummary
            task={mappedTask}
            navigation={props.navigation}
            onModalChoice={props.onModalChoice}
        >
        </TaskSummary>
    )

}


interface InputProps {
    task: Task
    navigation: any
    onModalChoice: (s: "complete" | "delete") => void;
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
