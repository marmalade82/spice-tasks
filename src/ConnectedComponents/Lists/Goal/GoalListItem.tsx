
import React from "react";

import {
    GoalListItem,
    Goal as IGoal,
} from "src/Components/Lists/Items/GoalListItem";

import Goal from "src/Models/Goal/Goal";
import withObservables from "@nozbe/with-observables";

interface Props {
    goal: Goal,
    navigation: any,
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
        ></GoalListItem>
    );
}

interface InputProps {
    goal: Goal
    navigation: any,
}

const enhance = withObservables(['goal'], (props: InputProps) => {
    return {
        goal: props.goal.observe()
    }
});

export const ConnectedGoalListItem = enhance(AdaptedGoalListItem);