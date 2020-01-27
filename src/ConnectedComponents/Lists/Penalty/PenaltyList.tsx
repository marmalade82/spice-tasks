
import React from "react";


import Penalty from "src/Models/Penalty/Penalty";
import withObservables from "@nozbe/with-observables";

import PenaltyQuery from "src/Models/Penalty/PenaltyQuery";
import List from "src/Components/Lists/base/List";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";
import { ConnectedPenaltyListItem } from "src/ConnectedComponents/Lists/Penalty/PenaltyListItem";

interface Props {
    penalties: Penalty[];
    navigation: any;
}

const AdaptedPenaltyList: React.FunctionComponent<Props> = (props: Props) => {
    
    const renderPenalty = (item: Penalty) => {
        return (
            <ClickNavigation
                navigation={props.navigation}
                parameters={{
                    id: item.id
                }}
                destination={"AddPenalty"}
                navType={"push"}
            >
                <ConnectedPenaltyListItem
                    penalty={item}
                >
                </ConnectedPenaltyListItem>
            </ClickNavigation>
        )
    }

    return (
        <List
            items={props.penalties} 
            renderItem={renderPenalty}
        >
        </List>
    )
}


interface InputProps {
    navigation: any
}

/**
 * Connects the list with the database
 */
const enhance = withObservables([], (_props: InputProps) => {
    return {
        penalties: new PenaltyQuery().queryAll().observe()
    }
});

export const ConnectedPenaltyList = enhance(AdaptedPenaltyList);
