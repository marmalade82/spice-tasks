import React from "react";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList"
import { ConnectedTaskSummary } from "src/ConnectedComponents/Summaries/TaskSummary";
import Task from "src/Models/Task/Task";
import TaskQuery, { TaskLogic } from "src/Models/Task/TaskQuery";
import {
    ColumnView, RowView, Button as MyButton,
    ViewPicker,
} from "src/Components/Basic/Basic";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";


interface Props {
    navigation: any
}

interface State {
    task?: Task;
}


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
        void new TaskLogic(this.props.navigation.getParam("id", "")).complete();
    }

    onTaskAction = (id: string, action: "complete" | "fail") => {
        switch(action) {
            case "complete": {
                void new TaskLogic(id).complete();
            } break; 
            case "fail": {
                void new TaskLogic(id).fail();
            } break;
        }
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
                <ColumnView style={{
                    flex: 1,
                }}>
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
                            onTaskAction={this.onTaskAction}
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
                            onTaskAction={this.onTaskAction}
                        ></ConnectedTaskList>
                    );
                }
            }
        ]
    }
}