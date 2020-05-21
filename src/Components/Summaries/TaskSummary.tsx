
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Style from "src/Style/Style";
import {
    ColumnView, RowView, BodyText,
} from "src/Components/Basic/Basic";
import { Summary, IconButton, ModalIconButton, ModalRow } from "src/Components/Styled/Styled"
import MyDate from "src/common/Date";
import { Navigation, ScreenParams } from "src/common/Navigator";
import { TaskParentTypes } from "src/Models/Task/Task";

interface Props {
    task: Task
    navigation: Navigation<ScreenParams>
    onModalChoice: (s: "complete" | "delete") => void;
}

interface State {
    showMore: boolean;
}

interface Task {
    id: string;
    title: string;
    instructions: string;
    start_date: Date;
    due_date: Date;
    time: Date;
    active: boolean;
}


export default class TaskSummary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showMore: false,
        }
    }

    render = () => {
        const { title, due_date, start_date, time, instructions, active, id } = this.props.task
        return (
            <Summary
                iconType={"task"}
                style={{}}
                headerText={title}
                bodyText={() => {
                    return (
                        <Text>
                            <BodyText
                                style={{}}
                            >
                                {instructions ? `${instructions}\n\n` : null}
                                {`${new MyDate(start_date).format("MMMM Do")} at ${new MyDate(time).format("h:mm A")}`}
                                {null /*`Due ${new MyDate(due_date).timeFromNow()}, on ${new MyDate(due_date).format("MMMM Do")}.`*/}
                            </BodyText>
                        </Text>
                    );
                }}
                footerElements={[
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
                                            text={"Edit"}
                                            iconType={"edit"}
                                            onPress={() => {
                                                this.props.navigation.push(
                                                    "AddTask", {
                                                        id: id,
                                                        parent_id: "",
                                                        parent_type: TaskParentTypes.NONE,
                                                    }
                                                );
                                                this.setState({
                                                    showMore: false,
                                                })
                                            }}
                                            accessibilityLabel={"task-edit-button"}
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