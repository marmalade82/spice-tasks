import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Style from "src/Style/Style";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList"
import { ConnectedTaskSummary } from "src/ConnectedComponents/Summaries/TaskSummary";
import Task from "src/Models/Task/Task";
import TaskQuery from "src/Models/Task/TaskQuery";
import {
    ColumnView, RowView,
} from "src/Components/Basic/Basic";
import NavigationButton from "src/Components/Navigation/NavigationButton";


interface Props {
    navigation: any
}

interface State {
    task?: Task;
}

const localStyle = StyleSheet.create({
    container: {
    },
    summary: {
        flex: 1,
    },
    actionHeader: {
        flex: 0.3,
    },
    actionItem: {
        backgroundColor: "lightyellow"
    },
    list: {
        flex: 2.7,
    },
    button: {
        position: 'absolute',
        right: 25,
        top: 25,
    },
    completeButton: {
        position: 'absolute',
        right: 25,
        bottom: 25,
    }
});


export default class TaskScreen extends React.Component<Props, State> {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Task',
        }
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            task: undefined
        }
    }

    componentDidMount = async () => {
        const id = this.props.navigation.getParam('id', '');
        const task = await new TaskQuery().get(id); 

        if(task) {
            this.setState({
                task: task
            })

        } else {
            this.setState({
                task: undefined
            });
        }
    }

    onCompleteTask = () => {

    }

    render = () => {
        return (
            <ColumnView style={[localStyle.container, Style.redBg]}>
                <ColumnView
                    style={[localStyle.summary, Style.yellowBg]}
                >
                    {this.renderSummary()}
                </ColumnView>
                <RowView style={[localStyle.actionHeader, Style.greenBg]}>
                    <ColumnView style={[localStyle.actionItem]}>
                    </ColumnView>
                    <ColumnView style={[localStyle.actionItem]}>
                        <NavigationButton
                            title={"+"}
                            navigation={this.props.navigation}
                            parameters={{
                                id: "", // The task is new, so no id.
                                parent_id: this.props.navigation.getParam("id", ""), // id of the task, since it is this task's parent.
                            }}
                            destination={'AddTask'}
                        ></NavigationButton>
                    </ColumnView>
                    <ColumnView style={[localStyle.actionItem]}>
                        <Button
                            title={"..."}
                            onPress={() => {}}
                        />
                    </ColumnView>
                </RowView>
                <ColumnView style={[Style.container, localStyle.list]}>
                    <ConnectedTaskList
                        navigation={this.props.navigation}
                        parentId={this.props.navigation.getParam('id', '')}
                    ></ConnectedTaskList>
                </ColumnView>
                <RowView style={[localStyle.button]}>
                    <NavigationButton
                        title={"edit"} 
                        navigation={this.props.navigation}
                        parameters={{
                            id: this.props.navigation.getParam('id', ''),
                        }}
                        color={"purple"}
                        destination={"AddTask"}
                    ></NavigationButton>
                </RowView>
                <RowView style={[localStyle.completeButton]}>
                    <Button
                        title={"Complete"}
                        onPress={() => {}}
                        accessibilityLabel={"button-task-complete"}
                    ></Button>
                </RowView>
            </ColumnView>
        );
    }

    renderSummary = () => {
        if(this.state.task) {
            return (
                    <ConnectedTaskSummary
                        task={this.state.task} 
                    ></ConnectedTaskSummary>
            );
        }
    }
}