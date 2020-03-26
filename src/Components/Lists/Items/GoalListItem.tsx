import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Item from "src/Components/Lists/Items/base/Item";
import { ListItem, ModalIconButton, ModalRow } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props {
    item: Goal
    accessibilityLabel: string
    navigation: Navigation<ScreenParams>
    onAction: OnGoalAction
    destTitle: "Goal" | "Habit"
}

export type OnGoalAction = (id: string, action: "complete" | "fail") => void;

interface State {
    showMore: boolean;
}

interface Goal {
    id: string;
    title: string;
    due_date: Date;
    type: string;
}

export default class GoalListItem extends Item<Props, State, Goal> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showMore: false,
        }
    }
    
    render = () => {
        const {id, title, due_date, type, } = this.props.item

        return (
            <ListItem
                navigation={this.props.navigation}
                params={{
                    id: id,
                    title: this.props.destTitle,
                }}
                destination={"Goal"}
                accessibilityLabel={this.props.accessibilityLabel}
                text={title}
                subtext={ new MyDate(due_date).format("MMM Do")}
                number={0}
                key={id}
                type={"goal"}
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
                                    text={"Mark complete"}
                                    iconType={"complete"}
                                    onPress={() => {
                                        this.setState({
                                            showMore: false,
                                        });
                                        this.props.onAction(id, "complete");
                                    }}
                                    accessibilityLabel={"complete-" + id}
                                ></ModalRow>
                                <ModalRow
                                    text={"Mark failed"}
                                    iconType={"fail"}
                                    onPress={() => {
                                        this.setState({
                                            showMore: false,
                                        });
                                        this.props.onAction(id, "fail");
                                    }}
                                    accessibilityLabel={"fail-" + id}
                                ></ModalRow>
                            </ModalIconButton>
                        )
                    }
                ]}
            >
            </ListItem>
        )
    }
}

export {
    GoalListItem,
    Goal,
}