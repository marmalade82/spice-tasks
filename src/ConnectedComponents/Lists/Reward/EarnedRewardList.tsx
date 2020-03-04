
import React from "react";


import EarnedReward from "src/Models/Reward/EarnedReward";
import withObservables from "@nozbe/with-observables";

import EarnedRewardQuery from "src/Models/Reward/EarnedRewardQuery";
import List from "src/Components/Lists/base/List";
import { ConnectedEarnedRewardListItem } from "src/ConnectedComponents/Lists/Reward/EarnedRewardListItem";
import { PagedList } from "src/Components/Styled/Styled";
import EmptyListItem from "src/Components/Lists/Items/EmptyListItem";
import EmptyList from "src/Components/Lists/EmptyList";

interface Props {
    earned: EarnedReward[];
    navigation: any;
    paginate?: number;
    emptyText?: string;
}

const AdaptedEarnedRewardList: React.FunctionComponent<Props> = (props: Props) => {
    
    const renderEarnedReward = (item: EarnedReward) => {
        return (
            <ConnectedEarnedRewardListItem
                earned={item}
                navigation={props.navigation}
            >
            </ConnectedEarnedRewardListItem>
        )
    }

    if(props.paginate) {
        return (
            <PagedList
                items={props.earned}
                pageMax={props.paginate}
                renderItem={renderEarnedReward}
                renderEmptyItem={() => {return <EmptyListItem></EmptyListItem>}}
                renderEmptyList={() => { 
                    return (
                        <EmptyList
                            text={props.emptyText ? props.emptyText : "You haven't earned any rewards" }
                        ></EmptyList>
                    );
                }}
            ></PagedList>
        )
    } else {
        return (
            <List
                items={props.earned} 
                renderItem={renderEarnedReward}
            >
            </List>
        )
    }
}

interface InputProps extends Omit<Props, "earned"> {
    type? : "active" | "unused",
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
                    earned: new EarnedRewardQuery().queryUnused().observe()
                }
            } break;
            case "unused": {
                return {
                    earned: new EarnedRewardQuery().queryUnused().observe()
                }
            } break;
            default: {
                return {
                    earned: new EarnedRewardQuery().queryAll().observe()
                }
            }
        }
    } else {
        return {
            earned: new EarnedRewardQuery().queryAll().observe()
        }
    }
});

export const ConnectedEarnedRewardList = enhance(AdaptedEarnedRewardList);