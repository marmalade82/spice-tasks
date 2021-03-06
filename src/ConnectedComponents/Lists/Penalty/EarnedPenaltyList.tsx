
import React, { useRef } from "react";
import EarnedPenalty from "src/Models/Penalty/EarnedPenalty";
import withObservables from "@nozbe/with-observables";

import EarnedPenaltyQuery from "src/Models/Penalty/EarnedPenaltyQuery";
import List from "src/Components/Lists/base/List";
import { ConnectedEarnedPenaltyListItem } from "src/ConnectedComponents/Lists/Penalty/EarnedPenaltyListItem";
import { PagedList } from "src/Components/Styled/Styled";
import EmptyListItem from "src/Components/Lists/Items/EmptyListItem";
import EmptyList from "src/Components/Lists/EmptyList";
import SwipeRow, { SwipeRight } from "src/Components/Basic/SwipeRow";
import { OnEarnedPenaltyAction } from "src/Components/Lists/Items/EarnedPenaltyListItem";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface SwipeProps extends Props {
    item: EarnedPenalty
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
            <ConnectedEarnedPenaltyListItem
                earned={item}
                navigation={props.navigation}
                onEarnedPenaltyAction={(id: string, action: "use") => {
                    if(action === "use" && props.onSwipeRight && swipeRef.current && swipeRef.current.notMocked()) {
                        swipeRef.current.swipeRight();
                    } else {
                        props.onEarnedPenaltyAction(id, action);
                    }
                }}
            >
            </ConnectedEarnedPenaltyListItem>
        </SwipeRow>
    )
}

interface Props {
    earned: EarnedPenalty[];
    navigation: Navigation<ScreenParams>;
    paginate?: number;
    emptyText?: string;
    onSwipeRight?: (id: string) => void;
    onEarnedPenaltyAction: OnEarnedPenaltyAction;

    type: undefined | "active" | "unused",
}

const AdaptedEarnedPenaltyList: React.FunctionComponent<Props> = (props: Props) => {
    
    const renderEarnedPenalty = (item: EarnedPenalty) => {
        if(item.active && props.onSwipeRight) { 
            return (
                <SwipeItem
                    item={item}
                    {...props}
                ></SwipeItem>
            ) 
        } else {
            return (
                <ConnectedEarnedPenaltyListItem
                    earned={item}
                    navigation={props.navigation}
                    onEarnedPenaltyAction={(id: string, action: "use") => {
                        props.onEarnedPenaltyAction(id, action);
                    }}
                >
                </ConnectedEarnedPenaltyListItem>
            )
        }
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
                navParams={{
                    navigation: props.navigation,
                    destination: "EarnedPenalties",
                    params: {
                        type: props.type
                    }
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