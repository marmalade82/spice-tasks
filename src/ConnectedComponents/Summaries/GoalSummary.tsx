
import React from "react";


import withObservables from "@nozbe/with-observables";
import {
    Goal
} from "src/Models/Goal/Goal";
import GoalSummary, { ModalChoices } from "src/Components/Summaries/GoalSummary";
import { GoalType } from "src/Models/Goal/GoalLogic";

interface Props {
    goal: Goal,
    navigation: any,
    onModalChoice: (s: ModalChoices) => void;
}

const AdaptedGoalSummary: React.FunctionComponent<Props> = (props: Props) => {
    const goal = props.goal;
    let type: "normal" | "streak";
    switch(goal.goalType) {
        case GoalType.NORMAL: type = "normal"; break;
        case GoalType.STREAK: type = "streak"; break;
        default: type = "normal";
    }

    let state: "open" | "completed" | "failed";

    if(goal.active) {
        state = "open";
    } else if (goal.state === "complete") {
        state = "completed"
    } else {
        state = "failed"
    }

    const mappedGoal = {
        title: goal.title,
        details: goal.details,
        start_date: goal.startDate,
        due_date: goal.dueDate, 
        type: type,
        state: state
    }

    return (
        <GoalSummary
            goal={mappedGoal}
            navigation={props.navigation}
            onModalChoice={props.onModalChoice}
        >
        </GoalSummary>
    )

}


interface InputProps {
    goal: Goal,
    navigation: any,
    onModalChoice: (s: ModalChoices) => void;
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
