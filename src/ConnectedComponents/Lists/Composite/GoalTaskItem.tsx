
import React from "react"
import Goal from "src/Models/Goal/Goal";
import { Task } from "src/Models/Task/Task";
import withObservables from "@nozbe/with-observables";
import { TaskListItem, Task as ITask } from "src/Components/Lists/Items/TaskListItem";
import { GoalListItem, Goal as IGoal} from "src/Components/Lists/Items/GoalListItem";
import { Navigation, ScreenParams } from "src/common/Navigator";



interface Props {
    id: string;
    model: Goal | Task;
    accessibilityLabel?: string;
    navigation: Navigation<ScreenParams>,
    onItemAction: (id: string, action: "complete" | "fail", item: "goal" | "task") => void;
}


const AdaptedGoalTaskItem: React.FunctionComponent<Props> = function(props: Props) {
    const createItemAction = (item: "goal" | "task") => {
        return (id: string, action: "complete" | "fail") => {
            props.onItemAction(id, action, item);
        }
    }

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
                accessibilityLabel={props.accessibilityLabel ? props.accessibilityLabel : "task-list-item"}
                navigation={props.navigation}
                onTaskAction={createItemAction("task")}
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
                accessibilityLabel={props.accessibilityLabel ? props.accessibilityLabel : "goal-list-item"}
                navigation={props.navigation}
                onAction={createItemAction("goal")}
            >

            </GoalListItem>
        );
    }

}

interface InputProps extends Props {

}

const enhance = withObservables(['id', 'model'], (props: InputProps) => {
    return {
        model: props.model.observe()
    }
});

export const ConnectedGoalTaskItem = enhance(AdaptedGoalTaskItem);

