
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Style from "src/Style/Style";
import {
    ColumnView, RowView, BodyText,
} from "src/Components/Basic/Basic";
import { Summary, IconButton, ModalIconButton, ModalRow } from "src/Components/Styled/Styled"
import MyDate from "src/common/Date";

interface Props {
    task: Task
    navigation: any
    onModalChoice: (s: "complete" | "delete") => void;
}

interface State {
    showMore: boolean;
}

interface Task {
    title: string;
    due_date: Date;
}


export default class TaskSummary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showMore: false,
        }
    }

    render = () => {
        const { title, due_date } = this.props.task
        return (
            <Summary
                iconType={"task"}
                style={{}}
                headerText={this.props.task.title}
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
                                        "AddTask", {
                                            id: this.props.navigation.getParam('id', ''),
                                        }
                                    );
                                }}
                                accessibilityLabel={"edit-task-button"}
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
                                        accessibilityLabel={"task-more-button"}
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
                                            accessibilityLabel={"task-complete-button"}
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
                                            accessibilityLabel={"task-delete-button"}
                                        ></ModalRow>
                                    </ModalIconButton>
                            );
                    },
                ]}
            ></Summary>
        )
    }
}

export {
    TaskSummary
}