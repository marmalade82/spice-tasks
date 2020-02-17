import React from "react";
import { Text, StyleSheet, Button } from "react-native";
import Style from "src/Style/Style";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList"
import { ConnectedTaskSummary } from "src/ConnectedComponents/Summaries/TaskSummary";
import Task from "src/Models/Task/Task";
import TaskQuery from "src/Models/Task/TaskQuery";
import {
    ColumnView, RowView, Button as MyButton,
    ViewPicker,
} from "src/Components/Basic/Basic";
import NavigationButton from "src/Components/Navigation/NavigationButton";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";


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
        // asynchronously complete task and descendants
        void new TaskQuery().completeTaskAndDescendants({
            id: this.props.navigation.getParam("id", "")
        });
    }

    onModalChoice = (str: "complete" | "delete") => {
        switch(str) {
            case "complete": {
                this.onCompleteTask();
            } break;
            case "delete": {

            } break;
            default: {
                // DO NOTHING
            }
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ScreenHeader>
                    Task Summary
                </ScreenHeader>
                {this.renderSummary()}
                <ColumnView style={[localStyle.list]}>
                    <ViewPicker
                        views={[...this.renderTaskLists()]}
                        data={false}
                        onDataChange={() => {}}
                        accessibilityLabel={"tasks"}
                        pickerHeight={60}
                    ></ViewPicker>
                </ColumnView>
            </DocumentView>
        );
    }

    renderSummary = () => {
        if(this.state.task) {
            return (
                <ConnectedTaskSummary
                    navigation={this.props.navigation}
                    task={this.state.task} 
                    onModalChoice={this.onModalChoice}
                ></ConnectedTaskSummary>
            );
        }
    }

    renderTaskLists = () => {
        return [
            {   title: "Active"
            ,   render: () => {
                    return (
                        <ConnectedTaskList
                            navigation={this.props.navigation}
                            parentId={this.props.navigation.getParam('id', '')}
                            type={"parent-active"}
                        ></ConnectedTaskList>
                    );
                }
            },
            {   title: "Inactive"
            ,   render: () => {
                    return (
                        <ConnectedTaskList
                            navigation={this.props.navigation}
                            parentId={this.props.navigation.getParam('id', '')}
                            type={"parent-inactive"}
                        ></ConnectedTaskList>
                    );
                }
            }
        ]
    }
}