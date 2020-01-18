import React from "react"
import Goal from "src/Models/Goal/Goal";
import { Task } from "src/Models/Task/Task";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";
import List from "src/Components/Lists/base/List";
import { Model } from "@nozbe/watermelondb";
import withObservables from "@nozbe/with-observables";
import TaskQuery from "src/Models/Task/TaskQuery";
import { ConnectedGoalTaskItem} from "src/ConnectedComponents/Lists/Composite/GoalTaskItem";

interface Props {
    navigation: any
    tasks: Task[]
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
        return props.tasks.map((task: Task) => {
            return {
                id: task.id,
                model: task,
            }
        });
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
}

const enhance = withObservables([], (_props: InputProps) => {
    return {
        tasks: new TaskQuery().queryActiveAndDueToday().observe()
    }
});

export const ConnectedGoalTaskList = enhance(AdaptedGoalTaskList);