
import React from "react";
import EarnedPenalty from "src/Models/Penalty/EarnedPenalty";
import withObservables from "@nozbe/with-observables";

import EarnedPenaltyQuery from "src/Models/Penalty/EarnedPenaltyQuery";
import List from "src/Components/Lists/base/List";
import { ConnectedEarnedPenaltyListItem } from "src/ConnectedComponents/Lists/Penalty/EarnedPenaltyListItem";
import { PagedList } from "src/Components/Styled/Styled";
import EmptyListItem from "src/Components/Lists/Items/EmptyListItem";
import EmptyList from "src/Components/Lists/EmptyList";

interface Props {
    earned: EarnedPenalty[];
    navigation: any;
    paginate?: number;
    emptyText?: string;
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

    if(props.paginate) {
        return (
            <PagedList
                items={props.earned}
                pageMax={props.paginate}
                renderItem={renderEarnedPenalty}
                renderEmptyItem={() => {return <EmptyListItem></EmptyListItem>}}
                renderEmptyList={() => { 
                    return (
                        <EmptyList
                            text={props.emptyText ? props.emptyText : "You haven't received any penalties" }
                        ></EmptyList>
                    );
                }}
            ></PagedList>
        )
    } else {
        return (
            <List
                items={props.earned} 
                renderItem={renderEarnedPenalty}
            >
            </List>
        )
    }

}

interface InputProps extends Omit<Props, "earned">{
    type?: "active" | "unused",
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
            case "unused": {
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