import React from "react"
import Goal from "src/Models/Goal/Goal";
import { Task } from "src/Models/Task/Task";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";
import List from "src/Components/Lists/base/List";
import { Model } from "@nozbe/watermelondb";
import withObservables from "@nozbe/with-observables";
import TaskQuery, { ActiveTaskQuery } from "src/Models/Task/TaskQuery";
import { ConnectedGoalTaskItem} from "src/ConnectedComponents/Lists/Composite/GoalTaskItem";
import GoalQuery, { ActiveGoalQuery } from "src/Models/Goal/GoalQuery";

interface Props {
    navigation: any
    tasks: Task[]
    goals: Goal[]
}

type Item = {
    id: string;
    model: Goal | Task;
    children: (Goal | Task) []
}

type Segregated = { roots: (Goal | Task)[], rootsMap: {}, children: (Goal | Task)[], childrenMap: {}};

/**
 * This list is responsible for rendering both tasks and goals together, organized as parent/children where possible
 * @param props 
 */
const AdaptedGoalTaskList: React.FunctionComponent<Props> = function(props: Props) {
    const renderItem = (item: Item) => {
        return (
               _renderItem(item)  
        );

        function getDestination(model: Goal | Task) {
            if(model instanceof Goal) {
                return "Goal";
            } else {
                return "Task";
            }
        }

        function _renderItem(item: Item) {
            return (
                <ConnectedGoalTaskItem
                    id={item.id}
                    model={item.model}
                    navigation={props.navigation}
                ></ConnectedGoalTaskItem>
            )
        }
    }

    const makeItems = () => {

        // Separate into models with no parents, and those with parents (children).
        // We want to show all models with no parents, and all children whose parents aren't in the list.
        const segregated: Segregated = (props.goals as (Goal | Task)[]).concat(props.tasks).reduce(segregate, { roots: [], rootsMap: {}, children: [], childrenMap: {}});
        const validChildren = segregated.children.filter((child: Goal | Task) => {
            return segregated.rootsMap[child.parentId] === undefined && segregated.childrenMap[child.parentId] === undefined;
        });
        const models: (Goal | Task)[] = [...segregated.roots, ...validChildren];

        const items = models.map((model: Goal | Task) => {
            return {
                id: model.id,
                model: model,
                children: [],
            }
        });

        return items;

        function segregate(acc: Segregated, el: Goal | Task) {
            if(el.parentId) {
                // then it was a child
                const newVal = {
                    roots: acc.roots,
                    rootsMap: acc.rootsMap,
                    children: [...acc.children, el],
                    childrenMap: {
                        [el.id]: el,
                        ...acc.childrenMap,
                    }
                }

                return newVal;
            } else {
                // then it was a parent
                const newVal = {
                    roots: [...acc.roots, el],
                    rootsMap: {
                        [el.id]: el,
                        ...acc.rootsMap,
                    },
                    children: acc.children,
                    childrenMap: acc.childrenMap
                }
                return newVal;
            }
        }
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
    type: "dueAndOverdueActive" | "startedButNotDueActive" | "notStartedActive"
}

const enhance = withObservables(['type'], (props: InputProps) => {
    if(props.type === "dueAndOverdueActive") {
        return {
            tasks: new ActiveTaskQuery().queryDueOrOverdue().observe(),
            goals: new ActiveGoalQuery().queryDueOrOverdue().observe(),
        }
    } else if(props.type === "startedButNotDueActive") {
        return {
            tasks: new ActiveTaskQuery().queryStartedButNotDue().observe(),
            goals: new ActiveGoalQuery().queryStartedButNotDue().observe(),
        }
    } else if (props.type === "notStartedActive") {
        return {
            tasks: new ActiveTaskQuery().queryNotStarted().observe(),
            goals: new ActiveGoalQuery().queryNotStarted().observe(),
        }
    } else {
        return {
            tasks: new TaskQuery().queryAll().observe(),
            goals: new GoalQuery().queryAll().observe(),
        }
    }
});

export const ConnectedGoalTaskList = enhance(AdaptedGoalTaskList);