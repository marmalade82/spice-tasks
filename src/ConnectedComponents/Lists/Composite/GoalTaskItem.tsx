
import React from "react"
import Goal from "src/Models/Goal/Goal";
import { Task } from "src/Models/Task/Task";
import withObservables from "@nozbe/with-observables";
import { TaskListItem, Task as ITask } from "src/Components/Lists/Items/TaskListItem";
import { GoalListItem, Goal as IGoal} from "src/Components/Lists/Items/GoalListItem";



interface Props {
    id: string;
    model: Goal | Task;
}


const AdaptedGoalTaskItem: React.FunctionComponent<Props> = function(props: Props) {
    if(props.model instanceof Task) {
        const task = props.model
        const mappedTask: ITask = {
            id: task.id,
            title: task.title,
            due_date: task.dueDate,
            start_date: task.startDate,
        };
        return (
            <TaskListItem
                item={mappedTask}
                accessibilityLabel={"task-list-item"}
            >

            </TaskListItem>
        );
    } else {
        const goal: Goal = props.model;
        const mappedGoal: IGoal = {
            id: goal.id,
            title: goal.title,
            due_date: goal.dueDate,
            type: goal.goalType,
        }

        return (
            <GoalListItem
                item={mappedGoal}
                accessibilityLabel={"goal-list-item"}
            >

            </GoalListItem>
        );
    }

}

interface InputProps {
    id: string;
    model: Goal | Task
}

const enhance = withObservables(['id', 'model'], (props: InputProps) => {
    return {
        model: props.model.observe()
    }
});

export const ConnectedGoalTaskItem = enhance(AdaptedGoalTaskItem);
