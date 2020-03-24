
import React, { useRef } from "react";


import withObservables from "@nozbe/with-observables";

import List from "src/Components/Lists/base/List";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";
import { observableWithRefreshTimer } from "src/Models/Global/GlobalQuery";
import { PagedList } from "src/Components/Styled/Styled";
import EmptyListItem from "src/Components/Lists/Items/EmptyListItem";
import EmptyList from "src/Components/Lists/EmptyList";
import SwipeRow from "src/Components/Basic/SwipeRow";
import { View } from "react-native"
import { PRIMARY_COLOR, ROW_CONTAINER_HEIGHT } from "src/Components/Styled/Styles";
import StreakCycle from "src/Models/Group/StreakCycle";
import StreakCycleQuery, { ChildStreakCycleQuery } from "src/Models/Group/StreakCycleQuery";
import { ConnectedStreakCycleListItem } from "src/ConnectedComponents/Lists/Group/StreakCycleListItem";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props {
    cycles: StreakCycle[];
    navigation: Navigation<ScreenParams>;
    paginate?: number;
    emptyText? : string;
    onSwipeRight?: (id: string) => void;
}

const AdaptedStreakCycleList: React.FunctionComponent<Props> = (props: Props) => {

    const renderCycle = (item: StreakCycle) => {
        return (
                <ConnectedStreakCycleListItem
                    cycle={item}
                    navigation={props.navigation}
                ></ConnectedStreakCycleListItem>
        )
    }

    if(props.paginate) {
        return (
            <PagedList
                items={props.cycles}
                pageMax={props.paginate}
                renderItem={renderCycle}
                renderEmptyItem={() => {return <EmptyListItem></EmptyListItem>}}
                renderEmptyList={() => { 
                    return (
                        <EmptyList
                            text={props.emptyText ? props.emptyText : "No previous cycles" }
                        ></EmptyList>
                    );
                }}
            ></PagedList>
        )
    } else {
        return (
            <List
                items={props.cycles} 
                renderItem={renderCycle}
            >
            </List>
        )
    }
}

interface InputProps extends Omit<Props, "cycles"> {
    type?: "previous"
    goalId?: string
}

const enhance = withObservables([], (props: InputProps) => {
    switch(props.type) {
        case "previous": {
            return {
                cycles: new GoalQuery().queryId(props.goalId ? props.goalId : "").observe().pipe(switchMap((goals) => {
                    const goal = goals[0];
                    if(goal) {
                        return observableWithRefreshTimer(() => new ChildStreakCycleQuery(goal.id).queryEndsOnBefore(goal.currentCycleEnd()).observe());
                    } else {
                        return new Observable<StreakCycle[]>((subscriber) => {
                            subscriber.next([])
                        });
                    }
                }))
            }
        } break;
        default: {
            return {
                cycles: new StreakCycleQuery().queryAll().observe(),
            }
        }
    }

})

export const ConnectedStreakCycleList = enhance(AdaptedStreakCycleList);