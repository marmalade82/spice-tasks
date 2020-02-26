
import React from "react";
import EarnedPenalty from "src/Models/Penalty/EarnedPenalty";
import withObservables from "@nozbe/with-observables";

import EarnedPenaltyQuery from "src/Models/Penalty/EarnedPenaltyQuery";
import List from "src/Components/Lists/base/List";
import { ConnectedEarnedPenaltyListItem } from "src/ConnectedComponents/Lists/Penalty/EarnedPenaltyListItem";

interface Props {
    earned: EarnedPenalty[];
    navigation: any;
}

const AdaptedEarnedPenaltyList: React.FunctionComponent<Props> = (props: Props) => {
    
    const renderEarnedPenalty = (item: EarnedPenalty) => {
        return (
            <ConnectedEarnedPenaltyListItem
                earned={item}
                navigation={props.navigation}
            >
            </ConnectedEarnedPenaltyListItem>
        )
    }

    return (
        <List
            items={props.earned} 
            renderItem={renderEarnedPenalty}
        >
        </List>
    )
}

interface InputProps {
    navigation: any,
    type?: "active",
}

/**
 * Connects the list with the database
 */
const enhance = withObservables([], (props: InputProps) => {
    const { type } = props;
    if(type) {
        switch(type) {
            case "active": {
                return {
                    earned: new EarnedPenaltyQuery().queryUnused().observe()
                }
            } break;
            default: {
                return {
                    earned: new EarnedPenaltyQuery().queryAll().observe()
                }
            }
        }
    } else {
        return {
            earned: new EarnedPenaltyQuery().queryAll().observe()
        }
    }
});

export const ConnectedEarnedPenaltyList = enhance(AdaptedEarnedPenaltyList);