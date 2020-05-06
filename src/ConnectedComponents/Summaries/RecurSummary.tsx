
import React from "react";


import withObservables from "@nozbe/with-observables";
import {
    Recur
} from "src/Models/Recurrence/Recur";
import RecurSummary, { ModalChoices } from "src/Components/Summaries/RecurSummary";
import GoalQuery, { Goal } from "src/Models/Goal/GoalQuery";
import { Navigation, ScreenParams } from "src/common/Navigator";
import TaskQuery from "src/Models/Task/TaskQuery";

interface Props {
    recur: Recur,
    navigation: Navigation<ScreenParams>,
    onModalChoice: (s: ModalChoices) => void;
    goals: Goal[];
}

const AdaptedRecurSummary: React.FunctionComponent<Props> = (props: Props) => {
    const recur = props.recur;
    const latestGoal = props.goals.sort((a, b) => {
        return b.startDate.valueOf() - a.startDate.valueOf();
    })[0];

    const mappedRecur = {
        id: recur.id,
        active: recur.active,
        type: recur.type,
        title: latestGoal ? latestGoal.title : "",
        details: latestGoal ? latestGoal.details: "",
    }

    return (
        <RecurSummary
            recur={mappedRecur}
            navigation={props.navigation}
            onModalChoice={props.onModalChoice}
        >
        </RecurSummary>
    )

}


interface InputProps extends Omit<Props, "goals"> {

}

/**
 * This function ensures that the component is connected to the database
 */

const enhance = withObservables(['recur'], (props: InputProps) => {
    return {
        recur: props.recur.observe(),
        goals: new TaskQuery().queryInRecurrence(props.recur.id).observe(),
    }
});

export const ConnectedRecurSummary = enhance(AdaptedRecurSummary);
