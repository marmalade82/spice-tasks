
import React from "react";

import {
    GoalListItem,
    Goal as IGoal,
} from "src/Components/Lists/Items/GoalListItem";

import Goal from "src/Models/Goal/Goal";
import withObservables from "@nozbe/with-observables";

import GoalQuery from "src/Models/Goal/GoalQuery";

interface Props {
    goal: Goal
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
        ></GoalListItem>
    );
}

interface InputProps {
    goal: Goal
}

const enhance = withObservables(['goal'], (props: InputProps) => {
    return {
        goal: props.goal
    }
});

export const ConnectedGoalListItem = enhance(AdaptedGoalListItem);