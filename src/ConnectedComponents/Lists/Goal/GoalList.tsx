import React from "react";

import {
    ConnectedGoalListItem
} from "src/ConnectedComponents/Lists/Goal/GoalListItem";

import Goal from "src/Models/Goal/Goal";
import withObservables from "@nozbe/with-observables";

import GoalQuery from "src/Models/Goal/GoalQuery";
import List from "src/Components/Lists/base/List";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";
import { observableWithRefreshTimer } from "src/Models/Global/GlobalQuery";
import { PagedList } from "src/Components/Styled/Styled";
import EmptyListItem from "src/Components/Lists/Items/EmptyListItem";
import SwipeRow from "src/Components/Basic/SwipeRow";
import { View } from "react-native"
import { PRIMARY_COLOR, ROW_CONTAINER_HEIGHT } from "src/Components/Styled/Styles";

interface Props {
    goals: Goal[];
    navigation: any;
    paginate?: number;
    onSwipeRight?: (id: string) => void;
}

const AdaptedGoalList: React.FunctionComponent<Props> = (props: Props) => {
    
    const renderGoal = (item: Goal) => {
        return (
            <SwipeRow
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
                <ConnectedGoalListItem
                    goal={item}
                    navigation={props.navigation}
                ></ConnectedGoalListItem>
            </SwipeRow>
        );
    }

    if(props.paginate) {
        return (
            <PagedList
                items={props.goals}
                pageMax={props.paginate}
                renderItem={renderGoal}
                renderEmptyItem={() => {return <EmptyListItem></EmptyListItem>}}
            ></PagedList>
        )
    } else {
        return (
            <List
                items={props.goals} 
                renderItem={renderGoal}
            >
            </List>
        )
    }
}

interface InputProps extends Omit<Props, "goals"> {
    type? : "overdue" | "in-progress-not-due" | "recurring" | "ongoing"
    parentId?: string;
}

/**
 * This function ensures that the enhanced component will always take its goals from the full list of goals. We may want to change this in the 
 * future based on props
 */

const enhance = withObservables([], (props: InputProps) => {
    switch(props.type) {
        case "overdue" : {
            return {
                goals: observableWithRefreshTimer( () => new GoalQuery().queryActiveAndOverdue().observe())
            }
        } break;
        case "in-progress-not-due": {
            return {
                goals: observableWithRefreshTimer(() => new GoalQuery().queryActiveAndStartedButNotDue().observe())
            }
        } break;
        case "recurring": {
            return {
                goals: new GoalQuery().inRecurrence(props.parentId ? props.parentId : "")
            }
        } break;
        case "ongoing": {
            return {
                goals: observableWithRefreshTimer( () => new GoalQuery().queryActiveAndStarted().observe() ),
            }
        } break;
        default: {
            return {
                goals: new GoalQuery().queryAll().observe()
            }
        }
    }
});

export const ConnectedGoalList = enhance(AdaptedGoalList);
