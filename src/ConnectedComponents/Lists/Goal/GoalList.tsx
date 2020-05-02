import React, { useRef, useState, useEffect } from "react";

import {
    ConnectedGoalListItem
} from "src/ConnectedComponents/Lists/Goal/GoalListItem";

import Goal from "src/Models/Goal/Goal";
import withObservables from "@nozbe/with-observables";

import GoalQuery, { ActiveGoalQuery } from "src/Models/Goal/GoalQuery";
import List from "src/Components/Lists/base/List";
import { observableWithRefreshTimer } from "src/Models/Global/GlobalQuery";
import { PagedList } from "src/Components/Styled/Styled";
import EmptyListItem from "src/Components/Lists/Items/EmptyListItem";
import SwipeRow, { SwipeRight } from "src/Components/Basic/SwipeRow";
import { OnGoalAction } from "src/Components/Lists/Items/GoalListItem";
import { Navigation, ScreenParams } from "src/common/Navigator";
import EmptyList from "src/Components/Lists/EmptyList";
import { FilterData, makeFilterState, getProviderData, Direction, Range, compare } from "../common/types";
import { IReadLocalState } from "src/Screens/common/StateProvider";
import MyDate from "src/common/Date";


interface SwipeProps extends Props {
    item: Goal
}

const SwipeItem: React.FunctionComponent<SwipeProps> = (props: SwipeProps) => {
    let swipeRef = useRef<SwipeRow>(null);
    let { item } = props;
    return (
        <SwipeRow
            ref={swipeRef}
            renderSwipeRight={() => {
                return <SwipeRight></SwipeRight>;
            }}
            onSwipeRightOpen={() => { props.onSwipeRight ? props.onSwipeRight(item.id): null }}
            key={item.id}
        >
            <ConnectedGoalListItem
                goal={item}
                navigation={props.navigation}
                onGoalAction={(id: string, action: "complete" | "fail") => {
                    if(action === "complete" && props.onSwipeRight && swipeRef.current && swipeRef.current.notMocked()) {
                        swipeRef.current.swipeRight();
                    } else {
                        props.onGoalAction(id, action);
                    }
                }}
            ></ConnectedGoalListItem>
        </SwipeRow>
    )
}

export interface Props {
    goals: Goal[];
    navigation: Navigation<ScreenParams>;
    paginate?: number;
    onSwipeRight?: (id: string) => void;
    onGoalAction: OnGoalAction;
    emptyText?: string;
    provider?: IReadLocalState<Data>

    type : "overdue" | "in-progress-not-due" | "recurring" | "ongoing" | "future" | undefined;
    parentId: undefined | string;
}

export type Data = FilterData<GoalFilter, GoalSorter>
export type GoalFilter = "all" | "ongoing" | "not started" | "overdue" | "failed" | "complete" | "recurring";
export type GoalSorter = "start" | "due" | "title"
export const makeGoalFilterState = makeFilterState;

const AdaptedGoalList: React.FunctionComponent<Props> = (props: Props) => {
    const [ filter, setFilter ] = useState<GoalFilter>(getProviderData(props.provider, "filter", "all"));
    const [ sorter, setSorter ] = useState<GoalSorter>(getProviderData(props.provider, "sorter", "start"));
    const [ direction, setDirection] = useState<Direction>(getProviderData(props.provider, "direction", "up"));
    const [ range, setRange ] = useState<Range>( getProviderData(props.provider, "range", undefined));

    useEffect(() => {
        if(props.provider) {
            props.provider.subscribe("filter", setFilter)
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

    let items: Goal[] = filterAndSort(props.goals, range, filter, sorter, direction);

    const renderGoal = (item: Goal) => {
        if(item.active && props.onSwipeRight) {
            return (
                <SwipeItem
                    item={item}
                    {...props}
                ></SwipeItem>
            );
        } else {
            return (
                    <ConnectedGoalListItem
                        goal={item}
                        navigation={props.navigation}
                        onGoalAction={(id: string, action: "complete" | "fail") => {
                            props.onGoalAction(id, action);
                        }}
                    ></ConnectedGoalListItem>
            )
        }
    }

    if(props.paginate) {
        return (
            <PagedList
                items={items}
                pageMax={props.paginate}
                renderItem={renderGoal}
                renderEmptyItem={() => {return <EmptyListItem></EmptyListItem>}}
                renderEmptyList={() => { 
                    return (
                        <EmptyList
                            text={props.emptyText ? props.emptyText : "No goals here." }
                        ></EmptyList>
                    );
                }}
                navParams={{
                    navigation: props.navigation,
                    destination: "Goals",
                    params: {
                        type: props.type,
                        parentId: props.parentId,
                    }
                }}
            ></PagedList>
        )
    } else {
        return (
            <List
                items={items} 
                renderItem={renderGoal}
            >
            </List>
        )
    }
}

interface InputProps extends Omit<Props, "goals"> {
}

/**
 * This function ensures that the enhanced component will always take its goals from the full list of goals. We may want to change this in the 
 * future based on props
 */

const enhance = withObservables([], (props: InputProps) => {
    switch(props.type) {
        case "overdue" : {
            return {
                goals: observableWithRefreshTimer( () => new ActiveGoalQuery().queryOverdue().observe())
            }
        } break;
        case "in-progress-not-due": {
            return {
                goals: observableWithRefreshTimer(() => new ActiveGoalQuery().queryStartedButNotDue().observe())
            }
        } break;
        case "recurring": {
            return {
                goals: new GoalQuery().inRecurrence(props.parentId ? props.parentId : "")
            }
        } break;
        case "ongoing": {
            return {
                goals: observableWithRefreshTimer( () => new ActiveGoalQuery().queryStarted().observe() ),
            }
        } break;
        case "future": {
            return {
                goals: observableWithRefreshTimer( () => new ActiveGoalQuery().queryNotStarted().observe() ),
            }
        }
        default: {
            return {
                goals: new GoalQuery().queryAll().observe()
            }
        }
    }
});

export const ConnectedGoalList = enhance(AdaptedGoalList);


function filterAndSort(items: Goal[], range: Range, filter: GoalFilter, sorter: GoalSorter, direction: Direction) {
        const now = MyDate.Now().toDate();
        return items.filter((goal) => {
            if(range === undefined) {
                return true;
            } else {
                let start = range[0]
                let end = range[1];
                if(end < start) {
                    return false;
                } else {
                    const endBeforeDate = MyDate.YBeforeX(goal.startDate, end) ;
                    const startAfterDate = MyDate.YAfterX(goal.startDate, start);
                    return !endBeforeDate && !startAfterDate
                }
            }
        }).filter((item) => {
            switch(filter) {
                case "all": {
                    return true;
                };
                case "complete": {
                    return !item.active && item.state === "complete";
                }
                case "failed": {
                    return !item.active && item.state === "cancelled";
                }
                case "not started": {
                    return item.active && MyDate.YBeforeX(item.startDate, now)
                } break;
                case "ongoing": {
                    return item.active && !MyDate.YAfterX(item.dueDate, now) && !MyDate.YBeforeX(item.startDate, now);
                } break;
                case "overdue": {
                    return item.active && MyDate.YAfterX(item.dueDate, now)
                }
                default: {
                    throw new Error("Unhandled goal filter: " + filter);
                }
            }
        }).sort((a, b) => {
            switch(sorter){
                case "start": {
                    return compare(a.startDate, b.startDate, direction);
                }
                case "due": {
                    return compare (a.dueDate, b.dueDate, direction);
                }
                case "title": {
                    return compare (a.title, b.title, direction);
                }
            }
        })
}