import React from "react"
import Goal from "src/Models/Goal/Goal";
import { Task } from "src/Models/Task/Task";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";
import List from "src/Components/Lists/base/List";
import { Model } from "@nozbe/watermelondb";
import withObservables from "@nozbe/with-observables";
import TaskQuery from "src/Models/Task/TaskQuery";
import { ConnectedGoalTaskItem} from "src/ConnectedComponents/Lists/Composite/GoalTaskItem";
import { merge } from "rxjs";
import GoalQuery from "src/Models/Goal/GoalQuery";

interface Props {
    navigation: any
    tasks: Task[]
    goals: Goal[]
}

type Item = {
    id: string;
    model: Goal | Task;
}

/**
 * This list is responsible for rendering both tasks and goals together, organized as parent/children where possible
 * @param props 
 */
const AdaptedGoalTaskList: React.FunctionComponent<Props> = function(props: Props) {
    const renderItem = (item: Item) => {
        return (
            <ClickNavigation
                navigation={props.navigation}
                parameters={{
                    id: item.model.id
                }}
                destination={getDestination(item.model)}
                navType={"push"}
            >
                    <ConnectedGoalTaskItem
                        id={item.id}
                        model={item.model}
                    ></ConnectedGoalTaskItem>
            </ClickNavigation>
        );

        function getDestination(model: Goal | Task) {
            if(model instanceof Goal) {
                return "Goal";
            } else {
                return "Task";
            }
        }
    }

    const makeItems = () => {
        const tasks: Item[] = props.tasks.map((task: Task) => {
            return {
                id: task.id,
                model: task,
            }
        });

        const goals: Item[] = props.goals.map((goal: Goal) => {
            return {
                id: goal.id,
                model: goal,
            }
        });

        return tasks.concat(goals);
    }

    return (
        <List
            items={makeItems()}
            renderItem={renderItem}
        >
        </List>
    )
}

interface InputProps {
    navigation: any
    type: "dueAndOverdueActive" | "startedButNotDueActive"
}

const enhance = withObservables(['type'], (props: InputProps) => {
    if(props.type === "dueAndOverdueActive") {
        return {
            tasks: new TaskQuery().queryActiveAndDue().observe(),
            goals: new GoalQuery().queryActiveAndDue().observe(),
        }
    } else if(props.type === "startedButNotDueActive") {
        return {
            tasks: new TaskQuery().queryActiveAndStartedButNotDue().observe(),
            goals: new GoalQuery().queryAll().observe(),
        }
    } else {
        return {
            tasks: new TaskQuery().queryAll().observe(),
            goals: new GoalQuery().queryAll().observe(),
        }
    }
});

export const ConnectedGoalTaskList = enhance(AdaptedGoalTaskList);