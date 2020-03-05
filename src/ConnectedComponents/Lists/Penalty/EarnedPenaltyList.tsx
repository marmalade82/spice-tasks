
import React, { useRef } from "react";
import EarnedPenalty from "src/Models/Penalty/EarnedPenalty";
import withObservables from "@nozbe/with-observables";

import EarnedPenaltyQuery from "src/Models/Penalty/EarnedPenaltyQuery";
import List from "src/Components/Lists/base/List";
import { ConnectedEarnedPenaltyListItem } from "src/ConnectedComponents/Lists/Penalty/EarnedPenaltyListItem";
import { PagedList } from "src/Components/Styled/Styled";
import EmptyListItem from "src/Components/Lists/Items/EmptyListItem";
import EmptyList from "src/Components/Lists/EmptyList";
import SwipeRow from "src/Components/Basic/SwipeRow";
import { View } from "react-native";
import { PRIMARY_COLOR, ROW_CONTAINER_HEIGHT } from "src/Components/Styled/Styles";
import { OnEarnedPenaltyAction } from "src/Components/Lists/Items/EarnedPenaltyListItem";

interface Props {
    earned: EarnedPenalty[];
    navigation: any;
    paginate?: number;
    emptyText?: string;
    onSwipeRight?: (id: string) => void;
    onEarnedPenaltyAction: OnEarnedPenaltyAction;
}

const AdaptedEarnedPenaltyList: React.FunctionComponent<Props> = (props: Props) => {
    
    const swipeRef = useRef<SwipeRow>(null);
    const renderEarnedPenalty = (item: EarnedPenalty) => {
        return (
            <SwipeRow
                ref={swipeRef}
                renderSwipeRight={() => {
                    return (
                        <View style={{
                            backgroundColor: PRIMARY_COLOR,
                            flex: 0,
                            height: ROW_CONTAINER_HEIGHT,
                            width: "100%",
                        }}>
                        </View>
                    )
                }}
                onSwipeRightOpen={() => { props.onSwipeRight ? props.onSwipeRight(item.id): null }}
                key={item.id}
            >
                <ConnectedEarnedPenaltyListItem
                    earned={item}
                    navigation={props.navigation}
                    onEarnedPenaltyAction={(id: string, action: "use") => {
                        if(action === "use" && props.onSwipeRight && swipeRef.current) {
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