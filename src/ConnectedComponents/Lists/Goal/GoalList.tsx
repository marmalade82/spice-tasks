import React from "react";

import {
    ConnectedGoalListItem
} from "src/ConnectedComponents/Lists/Goal/GoalListItem";

import Goal from "src/Models/Goal/Goal";
import withObservables from "@nozbe/with-observables";

import GoalQuery from "src/Models/Goal/GoalQuery";
import List from "src/Components/Lists/base/List";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";

interface Props {
    goals: Goal[];
    navigation: any;
}

const AdaptedGoalList: React.FunctionComponent<Props> = (props: Props) => {
    
    const renderGoal = (item: Goal) => {
        return (
            <ConnectedGoalListItem
                goal={item}
                navigation={props.navigation}
            ></ConnectedGoalListItem>
        );
    }

    return (
        <List
            items={props.goals} 
            renderItem={renderGoal}
        >
        </List>
    )
}

interface InputProps {
    navigation: any
    type? : "overdue" | "in-progress-not-due" | "recurring"
    parentId?: string;
}

/**
 * This function ensures that the enhanced component will always take its goals from the full list of goals. We may want to change this in the 
 * future based on props
 */

const enhance = withObservables([], (props: InputProps) => {
    switch(props.type) {
        case "overdue" : {
            return {
                goals: new GoalQuery().queryActiveAndOverdue().observe()
            }
        } break;
        case "in-progress-not-due": {
            return {
                goals: new GoalQuery().queryActiveAndStartedButNotDue().observe()
            }
        } break;
        case "recurring": {
            return {
                goals: new GoalQuery().inRecurrence(props.parentId ? props.parentId : "")
            }
        } break;
        default: {
            return {
                goals: new GoalQuery().queryAll().observe()
            }
        }
    }
});

export const ConnectedGoalList = enhance(AdaptedGoalList);
