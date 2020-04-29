
import React from "react";


import withObservables from "@nozbe/with-observables";
import {
    Task
} from "src/Models/Task/Task";
import TaskSummary from "src/Components/Summaries/TaskSummary";
import { FullNavigation } from "src/common/Navigator";

interface Props {
    task: Task,
    navigation: FullNavigation,
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
        time: task.startTime,
        id: task.id,
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


interface InputProps extends Props {

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
