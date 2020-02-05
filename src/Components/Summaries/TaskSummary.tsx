
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Style from "src/Style/Style";
import {
    ColumnView, RowView, BodyText,
} from "src/Components/Basic/Basic";
import { Summary, IconButton } from "src/Components/Styled/Styled"
import MyDate from "src/common/Date";

interface Props {
    task: Task
    navigation: any
}

interface State {

}

interface Task {
    title: string;
    due_date: Date;
}

const localStyle = StyleSheet.create({
    container: {
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    space: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})


export default class TaskSummary extends React.Component<Props, State> {


    render = () => {
        const { title, due_date } = this.props.task
        return (
            <Summary
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
                                            id: "", // The task is new, so no id.
                                            parent_id: this.props.navigation.getParam("id", ""), // id of the task, since it is this task's parent.
                                        }
                                    );
                                }}
                                accessibilityLabel={"add-task-button"}
                            ></IconButton>
                        );
                    },
                    () => { return <IconButton type={"more"}></IconButton>},
                ]}
            ></Summary>
        )
    }
}

export {
    TaskSummary
}