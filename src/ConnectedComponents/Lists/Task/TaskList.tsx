
import React, { useRef } from "react";

import {
    ConnectedTaskListItem
} from "src/ConnectedComponents/Lists/Task/TaskListItem";

import withObservables from "@nozbe/with-observables";
import {
    Task
} from "src/Models/Task/Task";
import TaskQuery from "src/Models/Task/TaskQuery";
import List from "src/Components/Lists/base/List";
import { PagedList } from "src/Components/Styled/Styled";
import { View } from "react-native";
import { observableWithRefreshTimer } from "src/Models/Global/GlobalQuery";
import EmptyListItem from "src/Components/Lists/Items/EmptyListItem";
import SwipeRow from "src/Components/Basic/SwipeRow";
import { PRIMARY_COLOR, ROW_CONTAINER_HEIGHT } from "src/Components/Styled/Styles";
import EmptyList from "src/Components/Lists/EmptyList";
import { prependToMemberExpression } from "@babel/types";
import { OnTaskAction } from "src/Components/Lists/Items/TaskListItem";
import StreakCycleQuery from "src/Models/Group/StreakCycleQuery";
import { switchMap } from "rxjs/operators";

interface Props {
    tasks: Task[];
    navigation: any;
    paginate?: number;
    onSwipeRight?: (id: string) => void;
    emptyText?: string;
    onTaskAction: OnTaskAction;
}

const AdaptedTaskList: React.FunctionComponent<Props> = (props: Props) => {
    let swipeRef = useRef<SwipeRow>(null);
    
    const renderTask = (item: Task) => {
        return (
            <SwipeRow
                ref={swipeRef}
                renderSwipeRight={() => {
                    return (
                        <View style={{
                            backgroundColor: PRIMARY_COLOR,
                            flex: 0,
                            height: ROW_CONTAINER_HEIGHT,
                            width: "100%",
                        }}>
                        </View>
                    )
                }}
                onSwipeRightOpen={() => { props.onSwipeRight ? props.onSwipeRight(item.id): null }}
                key={item.id}
            >
                    <ConnectedTaskListItem
                        task={item}
                        navigation={props.navigation}
                        onTaskAction={(id: string, action: "complete" | "fail") => {
                            if(action === "complete" && props.onSwipeRight && swipeRef.current && swipeRef.current.notMocked()) {
                                swipeRef.current.swipeRight();
                            } else {
                                props.onTaskAction(id, action);
                            }
                        }}
                    ></ConnectedTaskListItem>
            </SwipeRow>
        );
        
    }

    if(props.paginate) {
        return (
            <PagedList
                items={props.tasks}
                pageMax={props.paginate}
                renderItem={renderTask}
                renderEmptyItem={() => {return <EmptyListItem></EmptyListItem>}}
                renderEmptyList={() => { 
                    return (
                        <EmptyList
                            text={props.emptyText ? props.emptyText : "No tasks here." }
                        ></EmptyList>
                    );
                }}
            ></PagedList>
        )
    } else {
        return (
            <List
                items={props.tasks} 
                renderItem={renderTask}
            >
            </List>
        )
    }
}


interface InputProps extends Omit<Props, "tasks"> {
    type: 
        "all" | "parent-active" | "parent-inactive" | 
        "parent-all" | "active" | "active-due-soon-today" |
        "completed-today" | "in-progress-but-not-due-today" |
        "overdue" | "remaining-today" | "due-today" | "in-progress" | 
        "single" | "current-cycle";
    parentId: string  // shows all tasks that have this parent
    id?: string;
}

/**
 * This function ensures that the component is connected to the database
 */

const enhance = withObservables(['type'], (props: InputProps) => {
    switch(props.type) {
        case "active": {
            return {
                tasks: new TaskQuery().queryActiveTasks().observe()
            }
        } break;
        case "parent-active": {
            return {
                tasks: new TaskQuery().queryActiveHasParent(props.parentId).observe(),
            }
        } break;
        case "parent-inactive": {
            return {
                tasks: new TaskQuery().queryInactiveHasParent(props.parentId).observe(),
            }
        } break;
        case "active-due-soon-today": {
            return {
                tasks: new TaskQuery().queryActiveAndDueSoonToday().observe()
            }
        } break;
        case "completed-today" : {
            return {
                tasks: new TaskQuery().queryCompletedToday().observe()
            }
        } break;
        case "in-progress-but-not-due-today": {
            return {
                tasks: observableWithRefreshTimer(() => new TaskQuery().queryActiveAndStartedButNotDue().observe()),
            }
        } break;
        case "in-progress": {
            return {
                tasks: observableWithRefreshTimer(() => new TaskQuery().queryInProgress().observe() )
            }
        } break;
        case "due-today": {
            return {
                tasks: observableWithRefreshTimer( () => new TaskQuery().queryActiveAndDueToday().observe() )
            }
        } break;
        case "overdue": {
            return {
                tasks: observableWithRefreshTimer( () => new TaskQuery().queryActiveAndOverdue().observe())
            }
        } break;
        case "remaining-today": {
            return {
                tasks: observableWithRefreshTimer( () => new TaskQuery().queryRemainingToday().observe()),
            }
        } break;
        case "single": {
            return {
                tasks: new TaskQuery().queryId(props.id ? props.id : "").observe()
            }
        } break;
        case "current-cycle": {
            return {
                // This should provide a list of the tasks that are in the latest streak cycle
                tasks: new StreakCycleQuery().queryInGoal(props.parentId).observe().pipe(switchMap(( cycles ) => {
                    const sorted = cycles.sort((a, b) => {
                        return b.startDate.valueOf() - a.startDate.valueOf()
                    })

                    const latest = sorted[0];
                    return new TaskQuery().queryInSCycle(latest ? latest.id : "").observe()
                }))
            }
        } break;
        default: {
            return {
                tasks: new TaskQuery().queryAll().observe(),
            }
        }
    }
});

export const ConnectedTaskList = enhance(AdaptedTaskList);
