
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { 
    ColumnView, RowView,
} from "src/Components/Basic/Basic";
import Item from "src/Components/Lists/Items/base/Item";
import { RewardType } from "src/Models/Reward/RewardLogic";
import { ListItem, ModalIconButton, ModalRow } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";

interface EarnedReward {
    id: string;
    earnedDate: Date;
    type: Exclude<RewardType, "none">;
    goalId: string;
    title: string;
    details: string;
}

export type OnEarnedRewardAction = (id: string, action: "use") => void;

export interface Props {
    item: EarnedReward;
    accessibilityLabel: string
    navigation: any;
    onAction: OnEarnedRewardAction;
}

export interface State {
    showMore: boolean;
}


export default class EarnedRewardListItem extends Item<Props, State, EarnedReward> {
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
                destination={"EarnedReward"}
                text={title}
                subtext={new MyDate(earnedDate).format("MMM Do")}
                number={0}
                key={id}
                accessibilityLabel={this.props.accessibilityLabel}
                type={"earned_reward"}
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
    EarnedRewardListItem,
    EarnedReward,
}