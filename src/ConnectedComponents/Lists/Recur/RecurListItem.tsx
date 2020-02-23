
import React from "react";

import {
    RecurListItem,
    Recur as IRecur,
} from "src/Components/Lists/Items/RecurListItem";

import Recur from "src/Models/Recurrence/Recur";
import withObservables from "@nozbe/with-observables";
import Goal from "src/Models/Goal/Goal";
import GoalQuery from "src/Models/Goal/GoalQuery";

interface Props {
    recur: Recur,
    goals: Goal[],
    navigation: any,
}

const AdaptedRecurListItem: React.FunctionComponent<Props> = function(props: Props) {
    const recur = props.recur;
    const latestGoal = props.goals.sort((a, b) => {
        return b.startDate.valueOf() - a.startDate.valueOf();
    })[0];
    const mappedRecur: IRecur = {
        id: recur.id,
        active: recur.active,
        type: recur.type,
        title: latestGoal ? latestGoal.title : "This recurring goal has never been created",
    }

    return (
        <RecurListItem
            item={mappedRecur}
            accessibilityLabel={"recur-list-item"}
            navigation={props.navigation}
        ></RecurListItem>
    );
}

interface InputProps {
    recur: Recur
    navigation: any,
}

const enhance = withObservables(['recur'], (props: InputProps) => {
    return {
        recur: props.recur.observe(),
        goals: new GoalQuery().queryInRecurrence(props.recur.id).observe(),
    }
});

export const ConnectedRecurListItem = enhance(AdaptedRecurListItem);