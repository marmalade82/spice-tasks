

import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { 
    ColumnView, RowView,
} from "src/Components/Basic/Basic";
import Item from "src/Components/Lists/Items/base/Item";
import { PenaltyTypes } from "src/Models/Penalty/PenaltyLogic";
import { ListItem, ModalIconButton, ModalRow } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";

interface EarnedPenalty {
    id: string;
    earnedDate: Date;
    type: Exclude<PenaltyTypes, "none">;
    goalId: string;
    title: string;
    details: string;
}

interface Props {
    item: EarnedPenalty;
    accessibilityLabel: string
    navigation: any;
    onAction: OnEarnedPenaltyAction
}

export type OnEarnedPenaltyAction = (id: string, action: "use") => void;

interface State {
    showMore: boolean;
}

export default class EarnedPenaltyListItem extends Item<Props, State, EarnedPenalty> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showMore: false,
        }
    }
    
    render = () => {
        const { id, earnedDate, type, goalId, title, details } = this.props.item

        return (
            <ListItem
                navigation={this.props.navigation}
                params={{id: id}}
                destination={"EarnedPenalty"}
                text={title}
                subtext={new MyDate(earnedDate).format("MMM Do")}
                number={0}
                key={id}
                accessibilityLabel={this.props.accessibilityLabel}
                type={"earned_penalty"}
                footerIcons={[
                    () => {
                        return (
                            <ModalIconButton
                                type={"more"}
                                data={{
                                    showModal: this.state.showMore,
                                }}
                                onDataChange={({showModal}) => {
                                    this.setState({
                                        showMore: showModal
                                    })
                                }}
                            >
                                <ModalRow
                                    text={"Mark used"}
                                    iconType={"complete"}
                                    onPress={() => {
                                        this.setState({
                                            showMore: false,
                                        });
                                        this.props.onAction(id, "use");
                                    }}
                                    accessibilityLabel={"use-" + id}
                                ></ModalRow>
                            </ModalIconButton>
                        )
                    }
                ]}
            ></ListItem>
        )
    }
}

export {
    EarnedPenaltyListItem,
    EarnedPenalty,
}