
import React, { useRef, useState, useEffect } from "react";

import {
    ConnectedTaskListItem
} from "src/ConnectedComponents/Lists/Task/TaskListItem";

import withObservables from "@nozbe/with-observables";
import {
    Task
} from "src/Models/Task/Task";
import TaskQuery, { ActiveTaskQuery, ChildTaskQuery, ChildOfTaskQuery } from "src/Models/Task/TaskQuery";
import List from "src/Components/Lists/base/List";
import { PagedList } from "src/Components/Styled/Styled";
import { View } from "react-native";
import { observableWithRefreshTimer } from "src/Models/Global/GlobalQuery";
import EmptyListItem from "src/Components/Lists/Items/EmptyListItem";
import SwipeRow, { SwipeRight } from "src/Components/Basic/SwipeRow";
import EmptyList from "src/Components/Lists/EmptyList";
import { OnTaskAction } from "src/Components/Lists/Items/TaskListItem";
import StreakCycleQuery, { ChildStreakCycleQuery } from "src/Models/Group/StreakCycleQuery";
import { switchMap } from "rxjs/operators";
import { Navigation, ScreenParams } from "src/common/Navigator";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { Observable, from} from "rxjs";
import { merge } from "rxjs/operators";
import { GoalType } from "src/Models/Goal/GoalLogic";
import MyDate from "src/common/Date";
import { FilterBarProps, getProviderData, Range, Direction, FilterData, makeFilterState, compare } from "../common/types";
import { IReadLocalState, LocalState } from "src/Screens/common/StateProvider";
import { TaskContext } from "src/Models/Task/TaskQuery";


interface SwipedProps extends Props {
    item: TaskContext
}

const SwipedItem: React.FunctionComponent<SwipedProps> = (props: SwipedProps) => {
    let swipeRef = useRef<SwipeRow>(null) 
    let { item } = props;
    return (
        <SwipeRow
            ref={swipeRef}
            renderSwipeRight={() => {
                return <SwipeRight></SwipeRight>
            }}
            onSwipeRightOpen={() => { 
                if(props.onSwipeRight) {
                    props.onSwipeRight(item.id);
                    if(props.iconIndicates === "completion" && swipeRef.current && swipeRef.current.notMocked()) {
                        swipeRef.current.close();
                    }
                }
            }}
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
                    iconIndicates={props.iconIndicates}
                ></ConnectedTaskListItem>
        </SwipeRow>
    );
}

export interface LocalState {
    filter: TaskFilter,
    sorter: TaskSorter,
    direction: "up" | "down",
    range: Range,
}

interface Props {
    tasks: TaskContext[];
    navigation: Navigation<ScreenParams>;
    paginate?: number;
    onSwipeRight?: (id: string) => void;
    emptyText?: string;
    onTaskAction: OnTaskAction;
    iconIndicates?: "completion"
    accessibilityLabel? : string;
    provider?: IReadLocalState<Data>;

    type: 
        "all" | "parent-active" | "parent-inactive" | 
        "parent-all" | "active" | "active-due-soon-today" |
        "completed-today" | "in-progress-but-not-due-today" |
        "overdue" | "remaining-today" | "due-today" | "in-progress" | 
        "single" | "current-cycle" | "today-as-cycle" | 
        "overdue-in-goal" | "parent"
    parentId: string  // shows all tasks that have this parent
    id: undefined | string;
}

type Data = FilterData<TaskFilter, TaskSorter>

export type TaskFilter = "all" | "ongoing" | "not started" | "overdue" | "failed" | "complete";

export type TaskSorter = "start" | "due" | "title" | "description"

export const makeTaskLocalState = makeFilterState;

const AdaptedTaskList: React.FunctionComponent<Props> = (props: Props) => {
    const [ filter, setFilter ] = useState<TaskFilter>(getProviderData(props.provider, "filter", "all"));
    const [ sorter, setSorter ] = useState<TaskSorter>(getProviderData(props.provider, "sorter", "start"));
    const [ direction, setDirection] = useState<Direction>(getProviderData(props.provider, "direction", "up"));
    const [ range, setRange ] = useState<Range>( getProviderData(props.provider, "range", undefined ));

    useEffect(() => {
        if(props.provider) {
            props.provider.subscribe("filter", (val) => {
                setFilter(val);
            })
            props.provider.subscribe("sorter", setSorter)
            props.provider.subscribe("range", setRange)
            props.provider.subscribe("direction", setDirection)

            return () => {
                if(props.provider) {
                    props.provider.unsubscribeAll();
                }
            }
        }
    }, [])

    let items: TaskContext[] = filterAndSort(props.tasks, range, filter, sorter, direction);

    const renderTask = (item: TaskContext) => {
        if(item.active && props.onSwipeRight) {
            return (
                <SwipedItem
                    item={item}
                    {...props}
                ></SwipedItem>
            );
        } else {
            return (
                <ConnectedTaskListItem
                    task={item}
                    navigation={props.navigation}
                    onTaskAction={(id: string, action: "complete" | "fail") => {
                        props.onTaskAction(id, action);
                    }}
                    iconIndicates={props.iconIndicates}
                ></ConnectedTaskListItem>
            ) 
        }
    }

    if(props.paginate) {
        return (
            <View
                style={{
                    flex: 0,
                }}
            >
                <PagedList
                    items={items}
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
                    navParams={{
                        navigation: props.navigation,
                        destination: "Tasks",
                        params: {
                            type: props.type,
                            parentId: props.parentId,
                            id: props.id,
                        }
                    }}
                ></PagedList>
            </View>
        )
    } else {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                <List
                    items={items} 
                    renderItem={renderTask}
                >
                </List>
            </View>
        )
    }
}

function toContext(obs: Observable<Task[]>) {
    return obs.pipe(switchMap((tasks) => {
        const mapped = tasks.map(async (task) => {
            const context = new TaskContext(task.id);
            await context.initialize();
            return context;
        })
        const promise = Promise.all(mapped);

        return from(promise);
    }))
}


interface InputProps extends Omit<Props, "tasks"> {
}

/**
 * This function ensures that the component is connected to the database
 */
const enhance = withObservables(['type'], (props: InputProps) => {
    switch(props.type) {
        case "parent": {
            return {
                tasks: toContext(new ChildTaskQuery(props.parentId).queryAll().observe())
            }
        } break;
        case "active": {
            return {
                tasks: toContext(new ActiveTaskQuery().queryAll().observe())
            }
        } break;
        case "parent-active": {
            return {
                tasks: toContext(new ActiveTaskQuery().queryHasParent(props.parentId).observe())
            }
        } break;
        case "parent-inactive": {
            return {
                tasks: toContext(new ChildTaskQuery(props.parentId).queryInactive().observe())
            }
        } break;
        case "active-due-soon-today": {
            return {
                tasks: toContext(new ActiveTaskQuery().queryDueSoonToday().observe())
            }
        } break;
        case "completed-today" : {
            return {
                tasks: toContext(new TaskQuery().queryCompletedToday().observe())
            }
        } break;
        case "in-progress-but-not-due-today": {
            return {
                tasks: observableWithRefreshTimer(() => toContext(new ActiveTaskQuery().queryStartedButNotDue().observe())),
            }
        } break;
        case "in-progress": {
            return {
                tasks: observableWithRefreshTimer(() => toContext(new TaskQuery().queryInProgress().observe()) )
            }
        } break;
        case "due-today": {
            return {
                tasks: observableWithRefreshTimer( () => toContext(new ActiveTaskQuery().queryDueToday().observe()) )
            }
        } break;
        case "overdue": {
            return {
                tasks: observableWithRefreshTimer( () => toContext(new ActiveTaskQuery().queryOverdue().observe()) )
            }
        } break;
        case "overdue-in-goal": {
            let directChildTasks: Observable<Task[]> = new ChildTaskQuery(props.parentId).queryOverdue().observe();
            let streakChildTasks: Observable<Task[]> = new ChildStreakCycleQuery(props.parentId).queryAll().observe().pipe(switchMap((cycles) => {
                const ids: string[] = cycles.map((cycle) => {
                    return cycle.id;
                })
                return new ChildOfTaskQuery(ids).queryActiveOverdue().observe()
            }))
            return {
                tasks: observableWithRefreshTimer( () => {
                    return (
                        toContext(directChildTasks.pipe(merge(streakChildTasks)))
                    )
                })
            };
        } break;
        case "remaining-today": {
            return {
                tasks: observableWithRefreshTimer( () => toContext(new ActiveTaskQuery().queryRemainingToday().observe())),
            }
        } break;
        case "single": {
            return {
                tasks: toContext(new TaskQuery().queryId(props.id ? props.id : "").observe())
            }
        } break;
        case "today-as-cycle": {
            return {
                tasks: new GoalQuery().queryId(props.parentId).observe().pipe(switchMap((goals) => {
                    const goal = goals[0]
                    if(goal && goal.goalType === GoalType.STREAK) {
                        const thisStart: Date = MyDate.Now().thisCycleStart(goal.streakType, goal.startDate).toDate()
                        const thisEnd: Date = MyDate.Now().thisCycleEnd(goal.streakType, goal.startDate).toDate()
                        return toContext(new TaskQuery().queryStartsBetweenInclusive(thisStart, thisEnd).observe())
                    } else {
                        return toContext(new Observable<Task[]>((subscriber) => {
                            subscriber.next([])
                        }));
                    }
                }))
            }
        } break;
        case "current-cycle": {
            return {
                // This should provide a list of the tasks that are in the latest streak cycle
                tasks: toContext(new ChildStreakCycleQuery(props.parentId).queryAll().observe().pipe(switchMap(( cycles ) => {
                    const sorted = cycles.sort((a, b) => {
                        return b.startDate.valueOf() - a.startDate.valueOf()
                    })

                    const latest = sorted[0];
                    return new ActiveTaskQuery().queryInSCycle(latest ? latest.id : "").observe()
                })))
            }
        } break;
        default: {
            return {
                tasks: toContext(new TaskQuery().queryAll().observe()),
            }
        }
    }
});

export const ConnectedTaskList = enhance(AdaptedTaskList);


function filterAndSort(items: TaskContext[], range: [Date, Date] | undefined, filter: TaskFilter, sorter: TaskSorter, direction: "up" | "down") {
        const now = MyDate.Now().toDate();
        return items.filter((task) => {
            if(range === undefined) {
                return true;
            } else {
                let start = range[0]
                let end = range[1];
                if(end < start) {
                    return false;
                } else {
                    const endBeforeDate = MyDate.YBeforeX(task.startDate, end) ;
                    const startAfterDate = MyDate.YAfterX(task.startDate, start);
                    return !endBeforeDate && !startAfterDate
                }
            }
        }).filter((task) => {
            switch(filter) {
                case "all": {
                    return true;
                } break;
                case "complete": {
                    return !task.active && task.state === "complete"; 
                } break;
                case "failed": {
                    return !task.active && task.state === "cancelled";
                } break;
                case "not started": {
                    return task.active && MyDate.YBeforeX(task.startDate, MyDate.Now().toDate())
                } break;
                case "ongoing": {
                    return task.active && !MyDate.YAfterX(task.dueDate, now) && !MyDate.YBeforeX(task.startDate, now);
                } break;
                case "overdue": {
                    return task.active && MyDate.YAfterX(task.dueDate, MyDate.Now().toDate())
                }
            }

            return false;
        }).sort((a, b) => {
            switch(sorter) {
                case "start": {
                    let aStart = new MyDate(a.startDate).setTime(new MyDate(a.startTime)).toDate();
                    let bStart = new MyDate(b.startDate).setTime(new MyDate(b.startTime)).toDate();
                    return compare(aStart, bStart, direction)
                }
                case "due": {
                    return compare(a.dueDate, b.dueDate, direction)
                }
                case "title": {
                    return compare(a.title, b.title, direction)
                }
                case "description": {
                    return compare(a.instructions, b.instructions, direction);
                }
            }
        })

}