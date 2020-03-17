
import React, { useState, useEffect } from "react";


import withObservables from "@nozbe/with-observables";
import {
    Goal
} from "src/Models/Goal/Goal";
import GoalSummary, { ModalChoices } from "src/Components/Summaries/GoalSummary";
import { GoalType } from "src/Models/Goal/GoalLogic";
import { RewardTypes } from "src/Models/Reward/RewardLogic";
import { PenaltyTypes } from "src/Models/Penalty/PenaltyLogic";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props {
    goal: Goal,
    navigation: Navigation<ScreenParams>,
    onModalChoice: (s: ModalChoices) => void;
}

const AdaptedGoalSummary: React.FunctionComponent<Props> = (props: Props) => {
    const [reward, setReward ] = useState("None");
    const [penalty, setPenalty ] = useState("None");

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


    useEffect(() => {
        const rewardSub = goal.reward.subscribe((r) => {
            setReward(r.title);
        })

        const penaltySub = goal.penalty.subscribe((p) => {
            setPenalty(p.title);
        })
        return () => {
            rewardSub.unsubscribe();
            penaltySub.unsubscribe();
        }
    }, [])

    const mappedGoal = {
        title: goal.title,
        details: goal.details,
        start_date: goal.startDate,
        due_date: goal.dueDate, 
        type: type,
        state: state,
        reward: reward,
        penalty: penalty,
    }

    return (
        <GoalSummary
            goal={mappedGoal}
            navigation={props.navigation}
            showReward={goal.rewardType === RewardTypes.SPECIFIC}
            showPenalty={goal.penaltyType === PenaltyTypes.SPECIFIC}
            onModalChoice={props.onModalChoice}
        >
        </GoalSummary>
    )

}


interface InputProps extends Props {

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
