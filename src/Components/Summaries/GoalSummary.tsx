
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Style from "src/Style/Style";
import {
    ColumnView, RowView, BodyText,
} from "src/Components/Basic/Basic";
import { Summary, IconButton, ModalIconButton, ModalRow } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";
import { booleanLiteral } from "@babel/types";

interface Props {
    goal: Goal
    navigation: any;
    onModalChoice: (s: "complete" | "delete") => void;
}

interface State {
    showMore: boolean;
}

interface Goal {
    title: string;
    due_date: Date;
}



export default class GoalSummary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showMore: false,
        }
    }


    render = () => {
        const { title, due_date } = this.props.goal;
        return (
            <Summary
                style={{}}
                headerText={title}
                bodyText={() => {
                    return (
                        <Text>
                            <BodyText
                                style={{}}
                            >
                                {new MyDate(due_date).format("MMM Do")}
                            </BodyText>
                        </Text>
                    );
                }}
                footerElements={[
                    () => { 
                        return (
                            <IconButton type={"edit"}
                                onPress={() => {
                                    this.props.navigation.push(
                                        "AddGoal", {
                                            id: this.props.navigation.getParam('id', ''),
                                        }
                                    );
                                }}
                                accessibilityLabel={"edit-goal-button"}
                                key={"edit"}
                            >

                            </IconButton>
                        );
                    },
                    () => { 
                        return (
                            <IconButton type={"add"}
                                onPress={() => {
                                    this.props.navigation.push(
                                        "AddTask", {
                                            id: "", // The goal is new, so no id.
                                            parent_id: this.props.navigation.getParam("id", ""), // id of the goal, since it is this new task's parent.
                                        }
                                    );
                                }}
                                accessibilityLabel={"add-goal-button"}
                                key={"add"}
                            ></IconButton>
                        );
                    },
                    () => { return (
                                    <ModalIconButton type={"more"}
                                        data={{
                                            showModal: this.state.showMore
                                        }}
                                        onDataChange={({showModal}) => {
                                            this.setState({
                                                showMore: showModal
                                            })
                                        }}
                                        accessibilityLabel={"goal-more-button"}
                                        key={"more"}
                                    >
                                        <ModalRow
                                            text={"Complete"}
                                            iconType={"complete"}
                                            onPress={() => {
                                                this.props.onModalChoice("complete");
                                                this.setState({
                                                    showMore: false,
                                                })
                                            }}
                                            accessibilityLabel={"goal-complete-button"}
                                        ></ModalRow>
                                        <ModalRow
                                            text={"Delete"}
                                            iconType={"delete"}
                                            onPress={() => {
                                                this.props.onModalChoice("delete");
                                                this.setState({
                                                    showMore: false,
                                                })
                                            }}
                                            accessibilityLabel={"goal-delete-button"}
                                        ></ModalRow>
                                    </ModalIconButton>
                            );
                    },
                ]}
            ></Summary>
        );
    }
}

export {
    GoalSummary
}