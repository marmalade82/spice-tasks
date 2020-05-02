
import React, { useRef } from "react";


import EarnedReward from "src/Models/Reward/EarnedReward";
import withObservables from "@nozbe/with-observables";

import EarnedRewardQuery from "src/Models/Reward/EarnedRewardQuery";
import List from "src/Components/Lists/base/List";
import { ConnectedEarnedRewardListItem } from "src/ConnectedComponents/Lists/Reward/EarnedRewardListItem";
import { PagedList } from "src/Components/Styled/Styled";
import EmptyListItem from "src/Components/Lists/Items/EmptyListItem";
import EmptyList from "src/Components/Lists/EmptyList";
import SwipeRow, { SwipeRight } from "src/Components/Basic/SwipeRow";
import { OnEarnedRewardAction } from "src/Components/Lists/Items/EarnedRewardListItem";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface SwipeProps extends Props {
    item: EarnedReward
}

const SwipeItem: React.FunctionComponent<SwipeProps> = (props: SwipeProps) => {
    const swipeRef = useRef<SwipeRow>(null);
    let { item } = props;
    return (
        <SwipeRow
            ref={swipeRef}
            renderSwipeRight={() => {
                return <SwipeRight></SwipeRight>
            }}
            onSwipeRightOpen={() => { props.onSwipeRight ? props.onSwipeRight(item.id): null }}
            key={item.id}
        >
            <ConnectedEarnedRewardListItem
                earned={item}
                navigation={props.navigation}
                onAction={(id: string, action: "use") => {
                    if(action === "use" && props.onSwipeRight && swipeRef.current && swipeRef.current.notMocked()) {
                        swipeRef.current.swipeRight();
                    } else {
                        props.onEarnedRewardAction(id, action);
                    }
                }}
            >
            </ConnectedEarnedRewardListItem>
        </SwipeRow>
    )
}


interface Props {
    earned: EarnedReward[];
    navigation: Navigation<ScreenParams>;
    paginate?: number;
    emptyText?: string;
    onSwipeRight?: (id: string) => void;
    onEarnedRewardAction: OnEarnedRewardAction;

    type: undefined | "active" | "unused",
}

const AdaptedEarnedRewardList: React.FunctionComponent<Props> = (props: Props) => {
    const renderEarnedReward = (item: EarnedReward) => {
        if(item.active && props.onSwipeRight) {
            return (
                <SwipeItem
                    item={item}
                    {...props}
                ></SwipeItem>
            );
        } else {
            return (
                <ConnectedEarnedRewardListItem
                    earned={item}
                    navigation={props.navigation}
                    onAction={(id: string, action: "use") => {
                        props.onEarnedRewardAction(id, action);
                    }}
                >
                </ConnectedEarnedRewardListItem>
            )
        }
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
                navParams={{
                    navigation: props.navigation,
                    destination: "EarnedRewards",
                    params: {
                        type: props.type as string,
                    }
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