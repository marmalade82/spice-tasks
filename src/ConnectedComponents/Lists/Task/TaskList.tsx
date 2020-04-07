
import React, { useRef, useState } from "react";

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
import SwipeRow from "src/Components/Basic/SwipeRow";
import { PRIMARY_COLOR, ROW_CONTAINER_HEIGHT } from "src/Components/Styled/Styles";
import EmptyList from "src/Components/Lists/EmptyList";
import { prependToMemberExpression } from "@babel/types";
import { OnTaskAction } from "src/Components/Lists/Items/TaskListItem";
import StreakCycleQuery, { ChildStreakCycleQuery } from "src/Models/Group/StreakCycleQuery";
import { switchMap } from "rxjs/operators";
import { Navigation, ScreenParams } from "src/common/Navigator";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { Observable} from "rxjs";
import { merge } from "rxjs/operators";
import { GoalType } from "src/Models/Goal/GoalLogic";
import MyDate from "src/common/Date";
import SidescrollPicker from "src/Components/Styled/SidescrollPicker";
import * as v from "voca";


interface SwipedProps extends Props {
    item: Task
}

const SwipedItem: React.FunctionComponent<SwipedProps> = (props: SwipedProps) => {
    let swipeRef = useRef<SwipeRow>(null) 
    let { item } = props;
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

interface Props {
    tasks: Task[];
    navigation: Navigation<ScreenParams>;
    paginate?: number;
    onSwipeRight?: (id: string) => void;
    emptyText?: string;
    onTaskAction: OnTaskAction;
    iconIndicates?: "completion"
    withFilters?: Filter[] 
    withSorters?: Sorter[]
    accessibilityLabel? : string;
}

type Filter = "all" | "ongoing" | "not started" | "overdue" | "failed" | "complete";

type Sorter = "start" | "due" | "title" | "description"

type Range = [Date, Date] | undefined

const AdaptedTaskList: React.FunctionComponent<Props> = (props: Props) => {
    const [ filter, setFilter ] = useState<Filter>("all");
    const [ sorter, setSorter ] = useState<Sorter>("start");
    const [ direction, setDirection] = useState<"up" | "down">("up");
    const [ range, setRange ] = useState<Range>( undefined )

    let items: Task[];
    const now = MyDate.Now().toDate();
    if(props.withFilters && props.withFilters.length > 0) {
        items = props.tasks.filter((task) => {
            if(range === undefined) {
                console.log("RERENDERING ALL")
                return true;
            } else {
                let start = range[0]
                let end = range[1];
                if(end < start) {
                    console.log("END BEFORE START");
                    return false;
                } else {
                    const endBeforeDate = MyDate.YBeforeX(task.startDate, end) ;
                    const startAfterDate = MyDate.YAfterX(task.startDate, start);
                    console.log("CHECKING DATE " + endBeforeDate + " " + startAfterDate);
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
                    return MyDate.YBeforeX(task.startDate, MyDate.Now().toDate())
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
                    return sort(a.startDate, b.startDate, direction)
                }
                case "due": {
                    return sort(a.dueDate, b.dueDate, direction)
                }
                case "title": {
                    return sort(a.title, b.title, direction)
                }
                case "description": {
                    return sort(a.instructions, b.instructions, direction);
                }
            }
        })

        function sort<T extends Date | string | number>(a: T, b: T, direction: "up" | "down") {
            let multiplier: number = 1
            switch(direction) {
                case "up": {
                    multiplier = 1;
                } break;
                case "down": {
                    multiplier = -1;
                }
            }

            if(a instanceof Date) {
                return multiplier * ((a as Date).valueOf() - (b as Date).valueOf());
            }

            if(typeof a === "string") {
                let diff = 0
                if(a < b) {
                    diff = -1
                } else if (a > b) {
                    diff = 1
                } else {
                    diff = 0;
                }
                return multiplier * diff;
            }

            if(typeof a === "number") {
                return multiplier * ((a as number) - (b as number));
            }

            throw new Error("sort used on unsupported args")
        }

    } else {
        items = props.tasks;
    }

    const renderFilter = (filter: Filter, sorter: Sorter, dir: "up" | "down") => {
        if(props.withFilters && props.withFilters.length > 0) {
            return (
                <SidescrollPicker
                    initialFilter={filter}
                    initialSorter = { sorter }
                    initialDirection={dir}
                    filters={
                        makeChoices<Filter>(props.withFilters)
                    }
                    sorters={
                        makeChoices<Sorter>(props.withSorters ? props.withSorters : [])
                    }
                    onSubmit={( results) => {
                        console.log("receiving results " + JSON.stringify(results));
                        const { filter, direction, sorter, range } = results
                        setFilter(filter);
                        setDirection(direction);
                        setSorter(sorter);
                        setRange(range);
                    }}
                    accessibilityLabel={props.accessibilityLabel ? props.accessibilityLabel : "tasks"}
                ></SidescrollPicker>
            )
        } else {
            return null;
        }

        function makeChoices<Choice>(filters: Choice[]) {
            return filters.map((filter) => {
                return {
                    label: v.chain(filter)
                            .words().thru((str) => {
                                return str.map((s) => v.capitalize(s)).join(" ");
                            }).value(),
                    value: filter,
                    key: filter,
                }
            })
        }
    }
    
    const renderTask = (item: Task) => {
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
                {renderFilter(filter, sorter, direction)}
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
                {renderFilter(filter, sorter, direction)}
                <List
                    items={items} 
                    renderItem={renderTask}
                >
                </List>
            </View>
        )
    }
}


interface InputProps extends Omit<Props, "tasks"> {
    type: 
        "all" | "parent-active" | "parent-inactive" | 
        "parent-all" | "active" | "active-due-soon-today" |
        "completed-today" | "in-progress-but-not-due-today" |
        "overdue" | "remaining-today" | "due-today" | "in-progress" | 
        "single" | "current-cycle" | "today-as-cycle" | 
        "overdue-in-goal" | "parent";
    parentId: string  // shows all tasks that have this parent
    id?: string;
}

/**
 * This function ensures that the component is connected to the database
 */

const enhance = withObservables(['type'], (props: InputProps) => {
    switch(props.type) {
        case "parent": {
            return {
                tasks: new ChildTaskQuery(props.parentId).queryAll().observe()
            }
        } break;
        case "active": {
            return {
                tasks: new ActiveTaskQuery().queryAll().observe()
            }
        } break;
        case "parent-active": {
            return {
                tasks: new ActiveTaskQuery().queryHasParent(props.parentId).observe(),
            }
        } break;
        case "parent-inactive": {
            return {
                tasks: new ChildTaskQuery(props.parentId).queryInactive().observe(),
            }
        } break;
        case "active-due-soon-today": {
            return {
                tasks: new ActiveTaskQuery().queryDueSoonToday().observe()
            }
        } break;
        case "completed-today" : {
            return {
                tasks: new TaskQuery().queryCompletedToday().observe()
            }
        } break;
        case "in-progress-but-not-due-today": {
            return {
                tasks: observableWithRefreshTimer(() => new ActiveTaskQuery().queryStartedButNotDue().observe()),
            }
        } break;
        case "in-progress": {
            return {
                tasks: observableWithRefreshTimer(() => new TaskQuery().queryInProgress().observe() )
            }
        } break;
        case "due-today": {
            return {
                tasks: observableWithRefreshTimer( () => new ActiveTaskQuery().queryDueToday().observe() )
            }
        } break;
        case "overdue": {
            return {
                tasks: observableWithRefreshTimer( () => new ActiveTaskQuery().queryOverdue().observe())
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
                        directChildTasks.pipe(merge(streakChildTasks))
                    )
                })
            };
        } break;
        case "remaining-today": {
            return {
                tasks: observableWithRefreshTimer( () => new ActiveTaskQuery().queryRemainingToday().observe()),
            }
        } break;
        case "single": {
            return {
                tasks: new TaskQuery().queryId(props.id ? props.id : "").observe()
            }
        } break;
        case "today-as-cycle": {
            return {
                tasks: new GoalQuery().queryId(props.parentId).observe().pipe(switchMap((goals) => {
                    const goal = goals[0]
                    if(goal && goal.goalType === GoalType.STREAK) {
                        const thisStart: Date = MyDate.Now().thisCycleStart(goal.streakType, goal.startDate).toDate()
                        const thisEnd: Date = MyDate.Now().thisCycleEnd(goal.streakType, goal.startDate).toDate()
                        return new TaskQuery().queryStartsBetweenInclusive(thisStart, thisEnd).observe()
                    } else {
                        return new Observable<Task[]>((subscriber) => {
                            subscriber.next([])
                        });
                    }
                }))
            }
        } break;
        case "current-cycle": {
            return {
                // This should provide a list of the tasks that are in the latest streak cycle
                tasks: new ChildStreakCycleQuery(props.parentId).queryAll().observe().pipe(switchMap(( cycles ) => {
                    const sorted = cycles.sort((a, b) => {
                        return b.startDate.valueOf() - a.startDate.valueOf()
                    })

                    const latest = sorted[0];
                    return new ActiveTaskQuery().queryInSCycle(latest ? latest.id : "").observe()
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
