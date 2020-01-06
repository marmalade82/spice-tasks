import React from "react";

import Goal from "src/Models/Goal/Goal";
import { AddGoalForm, AddGoalDefault} from "src/Components/Forms/AddGoalForm";
import withObservables from "@nozbe/with-observables";

interface Props {
    goal: Goal
    navigation: any
}

const AdaptedAddGoalForm: React.FunctionComponent<Props> = (props: Props) => {

    const goal = props.goal;
    let data = AddGoalDefault;
    data.title = goal.title;
    data.type = goal.type;
    data.start_date = goal.startDate;
    data.due_date = goal.dueDate;

    return (
        <AddGoalForm
            navigation={props.navigation}
            onDataChange={() => {}}
            data={ data }
        
        ></AddGoalForm>
    )
}

const enhance = withObservables(['goal'], (props: Props) => {
    return {
        goal: props.goal
    };
});

export const ConnectedAddGoalForm = enhance(AdaptedAddGoalForm);