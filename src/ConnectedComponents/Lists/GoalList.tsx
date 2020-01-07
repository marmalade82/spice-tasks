import React from "react";

import {
    GoalList,
    IGoal,
} from "src/Components/Lists/GoalList";

import Goal from "src/Models/Goal/Goal";
import withObservables from "@nozbe/with-observables";

import GoalQuery from "src/Models/Goal/GoalQuery";

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
