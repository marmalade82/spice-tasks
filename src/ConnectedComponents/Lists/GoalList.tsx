import React from "react";

import {
    GoalList,
    IGoal,
} from "src/Components/Lists/GoalList";

import Goal from "src/Models/Goal/Goal";
import withObservables from "@nozbe/with-observables";

import GoalQuery from "src/Models/Goal/GoalQuery";

interface Props {
    goals: Goal[];
    navigation: any;
}

const AdaptedGoalList: React.FunctionComponent<Props> = (props: Props) => {
    const mappedGoals: IGoal[] = props.goals.map((goal: Goal) => {
        const g: IGoal = {
            id: goal.id,
            title: goal.title,
            due_date: goal.dueDate,
            type: goal.goalType, 
        };

        return g;
    });

    return (
        <GoalList
            navigation={props.navigation}
            goals={mappedGoals} 
        ></GoalList>
    );
}

interface InputProps {
    navigation: any
}

/**
 * This function ensures that the enhanced component will always take its goals from the full list of goals. We may want to change this in the 
 * future based on props
 */

const enhance = withObservables([], (_props: InputProps) => {
    return {
        goals: GoalQuery.queryAll().observe()
    }
});

export const ConnectedGoalList = enhance(AdaptedGoalList);
