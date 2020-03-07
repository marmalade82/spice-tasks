import React from "react";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList"
import { ConnectedTaskSummary } from "src/ConnectedComponents/Summaries/TaskSummary";
import Task, { TaskParentTypes } from "src/Models/Task/Task";
import TaskQuery, { TaskLogic } from "src/Models/Task/TaskQuery";
import {
    ColumnView, RowView, Button as MyButton,
    ViewPicker,
} from "src/Components/Basic/Basic";
import { DocumentView, ScreenHeader, BackgroundTitle, ModalIconButton, ModalRow } from "src/Components/Styled/Styled";
import { View, ScrollView } from "react-native";


interface Props {
    navigation: any
}

interface State {
    task?: Task;
    activeCount: number;
    inactiveCount: number;
    showAdd: boolean;
}


export default class TaskScreen extends React.Component<Props, State> {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Task',
        }
    }

    unsubscribe: () => void;
    constructor(props: Props) {
        super(props);
        this.state = {
            task: undefined,
            activeCount: 0,
            inactiveCount: 0,
            showAdd: false,
        }
        this.unsubscribe = () => {};
    }

    componentDidMount = async () => {
        const id = this.props.navigation.getParam('id', '');
        const task = await new TaskQuery().get(id); 

        if(task) {
            this.setState({
                task: task
            })
            const activeSub = new TaskQuery().queryActiveHasParent(task.id).observeCount().subscribe((num) => {
                this.setState({
                    activeCount: num,
                })
            });
            const inactiveSub = new TaskQuery().queryInactiveHasParent(task.id).observeCount().subscribe((num) => {
                this.setState({
                    inactiveCount: num,
                })
            })
            this.unsubscribe = () => {
                activeSub.unsubscribe();
                inactiveSub.unsubscribe();
            }

        } else {
            this.setState({
                task: undefined
            });
        }
    }

    componentWillUnmount = () => {
        this.unsubscribe();
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

                <ScrollView>
                    {this.renderSummary()}

                    <BackgroundTitle title={`Active (${this.state.activeCount})`}
                        style={{
                        }}
                    ></BackgroundTitle>
                    <ConnectedTaskList
                        navigation={this.props.navigation}
                        parentId={this.props.navigation.getParam('id', '')}
                        type={"parent-active"}
                        paginate={4}
                        onSwipeRight={(id: string) => {
                            this.onTaskAction(id, "complete")
                        }}
                        emptyText={"No active subtasks"}
                        onTaskAction={this.onTaskAction}
                    ></ConnectedTaskList>
                    <BackgroundTitle title={`Inactive (${this.state.inactiveCount})`}
                        style={{
                        }}
                    ></BackgroundTitle>
                    <ConnectedTaskList
                        navigation={this.props.navigation}
                        parentId={this.props.navigation.getParam('id', '')}
                        type={"parent-inactive"}
                        onTaskAction={this.onTaskAction}
                        paginate={4}
                        emptyText={"No inactive subtasks"}
                    ></ConnectedTaskList>
                </ScrollView>
                <View
                    style={{
                        flex: 0,
                        position: "absolute",
                        right: 50,
                        bottom: 20,
                    }}
                >
                    <ModalIconButton type={"add"}
                        data={{
                            showModal: this.state.showAdd
                        }}
                        onDataChange={({ showModal }) => {
                            this.setState({
                                showAdd: showModal
                            })
                        }}
                        size={30}
                        overlaySize={50}
                    >
                        <ModalRow
                            text={"Task"}
                            iconType={"task"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.props.navigation.push("AddTask", {
                                    parent_id: this.props.navigation.getParam("id", ""),
                                    parent_type: TaskParentTypes.TASK,
                                })
                                this.setState({
                                    showAdd: false,
                                })
                            }}
                            accessibilityLabel={"add-task-button"}
                            key={"add"}
                        ></ModalRow>
                    </ModalIconButton>
                </View>
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
}