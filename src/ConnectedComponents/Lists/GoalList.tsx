import React from "react";

import {
    GoalList,
    IGoal,
} from "src/Components/Lists/GoalList";

import Goal from "src/Models/Goal/Goal";
import withObservables from "@nozbe/with-observables";

interface Props {
    goals: Goal[]
}

const AdaptedGoalList: React.FunctionComponent<Props> = (props: Props) => {
    const mappedGoals: IGoal[] = props.goals.map((goal: Goal) => {
        return {
            id: goal.id,
            title: goal.title,
            due_date: goal.dueDate,
            type: goal.type, 
        };
    });

    return (
        <GoalList
            goals={mappedGoals} 
        ></GoalList>
    );
}

interface InputProps {
    goals: any
}

/**
 * This function isn't done. I want this list to be able to take any query and render the resulting list of goals.
 * To do so, the props should take a query
 */

const enhance = withObservables(['goals'], (props: InputProps) => {
    return {
        goals: props.goals.observe(),
    }
});

export const ConnectedGoalList = enhance(AdaptedGoalList);
