
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Style from "src/Style/Style";
import {
    ColumnView, RowView, BodyText,
} from "src/Components/Basic/Basic";
import { Summary, IconButton, ModalIconButton, ModalRow } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";
import { booleanLiteral } from "@babel/types";
import { Navigation, ScreenParams } from "src/common/Navigator";

export type ModalChoices = "complete" | "delete" | "incomplete"

interface Props {
    goal: Goal
    navigation: Navigation<ScreenParams>;
    onModalChoice: (s: ModalChoices) => void;
    showReward: boolean;
    showPenalty: boolean;
}

interface State {
    showMore: boolean;
}

interface Goal {
    title: string;
    details: string;
    start_date: Date;
    due_date: Date;
    type: "streak" | "normal"
    state: "open" | "completed" | "failed"
    reward: string;
    penalty: string;
}



export default class GoalSummary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showMore: false,
        }
    }


    render = () => {
        const { title, start_date, due_date, details, reward, penalty  } = this.props.goal;
        return (
            <Summary
                iconType={"goal"}
                style={{}}
                headerText={title}
                bodyText={() => {
                    return (
                        <Text>
                            <BodyText
                                style={{}}
                            >
                                {details ? details + '\n\n': ""}
                                {`Starts on ${new MyDate(start_date).format("MMMM Do")}.\n`}
                                {`Due ${new MyDate(due_date).timeFromNow()}, on ${new MyDate(due_date).format("MMMM Do")}.\n`}
                                {`\n`}
                                {`Reward: ${this.props.showReward ? reward : "None"}\n`}
                                {`Penalty: ${this.props.showPenalty ? penalty : "None"}\n`}
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
                                        <ModalRow
                                            text={"Mark Incomplete"}
                                            iconType={"goal"}
                                            onPress={() => {
                                                this.props.onModalChoice("incomplete");
                                                this.setState({
                                                    showMore: false,
                                                })
                                            }}
                                            accessibilityLabel={"goal-incomplete-button"}
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