
import React from "react";


import withObservables from "@nozbe/with-observables";
import {
    Goal
} from "src/Models/Goal/Goal";
import GoalSummary from "src/Components/Summaries/GoalSummary";

interface Props {
    goal: Goal,
}

const AdaptedGoalSummary: React.FunctionComponent<Props> = (props: Props) => {
    const goal = props.goal;
    const mappedGoal = {
        title: goal.title,
        due_date: goal.dueDate, 
    }

    return (
        <GoalSummary
            goal={mappedGoal}
        >
        </GoalSummary>
    )

}


interface InputProps {
    goal: Goal
}

/**
 * This function ensures that the component is connected to the database
 */

const enhance = withObservables(['goal'], (props: InputProps) => {
    return {
        goal: props.goal.observe()
    }
});

export const ConnectedGoalSummary = enhance(AdaptedGoalSummary);
