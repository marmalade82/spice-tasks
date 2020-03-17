
import React from "react";

import {
    GoalListItem,
    Goal as IGoal,
    OnGoalAction,
} from "src/Components/Lists/Items/GoalListItem";

import Goal from "src/Models/Goal/Goal";
import withObservables from "@nozbe/with-observables";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props {
    goal: Goal,
    navigation: Navigation<ScreenParams>,
    onGoalAction: OnGoalAction;
}

const AdaptedGoalListItem: React.FunctionComponent<Props> = function(props: Props) {
    const goal = props.goal;
    const mappedGoal: IGoal = {
        id: goal.id,
        due_date: goal.dueDate,
        type: goal.goalType,
        title: goal.title,
    }

    return (
        <GoalListItem
            item={mappedGoal}
            accessibilityLabel={"goal-list-item"}
            navigation={props.navigation}
            onAction={props.onGoalAction}
        ></GoalListItem>
    );
}

interface InputProps extends Props {

}

const enhance = withObservables(['goal'], (props: InputProps) => {
    return {
        goal: props.goal.observe()
    }
});

export const ConnectedGoalListItem = enhance(AdaptedGoalListItem);