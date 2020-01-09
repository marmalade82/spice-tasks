import React from "react";

import Goal from "src/Models/Goal/Goal";
import { AddGoalForm, AddGoalDefault, AddGoalData} from "src/Components/Forms/AddGoalForm";
import withObservables from "@nozbe/with-observables";

interface Props {
    goal: Goal
    navigation: any
    onDataChange: (d: AddGoalData) => void;
}

const AdaptedAddGoalForm: React.FunctionComponent<Props> = (props: Props) => {

    const goal = props.goal;
    let data: AddGoalData = {
        title : goal.title,
        type : goal.goalType,
        start_date : goal.startDate,
        due_date : goal.dueDate,
        recurring: AddGoalDefault().recurring,
        recurData: AddGoalDefault().recurData,
        reward: AddGoalDefault().reward,
        penalty: AddGoalDefault().penalty,
        streakData: {
            minimum: goal.streakMinimum,
            type: goal.streakType,
            daily_start: goal.streakDailyStart,
            weekly_start: goal.streakWeeklyStart,
            monthly_start: goal.streakMonthlyStart,
        }
    }

    return (
        <AddGoalForm
            navigation={props.navigation}
            onDataChange={props.onDataChange}
            data={ false }
        ></AddGoalForm>
    )
}

const enhance = withObservables(['goal'], (props: Props) => {
    return {
        goal: props.goal
    };
});

export const ConnectedAddGoalForm = enhance(AdaptedAddGoalForm);
