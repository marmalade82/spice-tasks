import React from "react";
import { ConnectedTaskList, TaskFilter, TaskSorter, makeTaskLocalState } from "src/ConnectedComponents/Lists/Task/TaskList"
import { ConnectedTaskSummary } from "src/ConnectedComponents/Summaries/TaskSummary";
import Task, { TaskParentTypes } from "src/Models/Task/Task";
import TaskQuery, { TaskLogic, ActiveTaskQuery, ChildTaskQuery } from "src/Models/Task/TaskQuery";
import {
    ColumnView, RowView, Button as MyButton,
    ViewPicker,
} from "src/Components/Basic/Basic";
import { DocumentView, ScreenHeader, BackgroundTitle, Modal, ModalIconButton, ModalRow } from "src/Components/Styled/Styled";
import { View, ScrollView } from "react-native";
import ConnectedSingleList from "src/ConnectedComponents/Lists/SingleList";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";
import SidescrollPicker, { makeChoices } from "src/Components/Styled/SidescrollPicker";


interface Props {
    navigation: object
}

interface State {
    task?: Task;
    activeCount: number;
    inactiveCount: number;
    showAdd: boolean;
}

const dispatcher = new EventDispatcher();

export default class TaskScreen extends React.Component<Props, State> {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Task',
            right: [
                () => {
                    return (
                        <HeaderAddButton
                            dispatcher={dispatcher}
                            eventName={getKey(navigation)}
                        ></HeaderAddButton>
                    )
                }
            ]
        }
    }

    readonly activeTaskFilterState = makeTaskLocalState<TaskFilter, TaskSorter>("all", "start", undefined, "up");
    readonly inactiveTaskFilterState = makeTaskLocalState<TaskFilter, TaskSorter>("all", "start", undefined, "up");
    unsubscribe: () => void;
    navigation: MainNavigator<"Task">
    constructor(props: Props) {
        super(props);
        this.state = {
            task: undefined,
            activeCount: 0,
            inactiveCount: 0,
            showAdd: false,
        }
        this.unsubscribe = () => {};
        this.navigation = new ScreenNavigation(props);
    }

    componentDidMount = async () => {
        const id = this.navigation.getParam('id', '');
        const task = await new TaskQuery().get(id); 

        if(task) {
            this.setState({
                task: task
            })
            const activeSub = new ActiveTaskQuery().queryHasParent(task.id).observeCount().subscribe((num) => {
                this.setState({
                    activeCount: num,
                })
            });
            const inactiveSub = new ChildTaskQuery(task.id).queryInactive().observeCount().subscribe((num) => {
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
        dispatcher.addEventListener(getKey(this.navigation), this.onClickAdd)
    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.navigation), this.onClickAdd)
        this.unsubscribe();
    }

    onClickAdd = () => {
        this.setState({
            showAdd: true,
        })
    }

    onCompleteTask = () => {
        void new TaskLogic(this.navigation.getParam("id", "")).complete();
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
        const activeFilter: TaskFilter[] = [
            "all", "ongoing", "not started", "overdue"
        ]
        const activeSorter: TaskSorter[] = [
            "start", "title",
        ]
        const inactiveFilter: TaskFilter[] = [
            "all", "complete", "failed",
        ]
        const inactiveSorter: TaskSorter[] = [
            "start", "title",
        ]
        return (
            <DocumentView accessibilityLabel={"task"}>
                <ScrollView>

                    {this.renderSummary()}

                    <SidescrollPicker
                        label={`Active (${this.state.activeCount})`}
                        filters={makeChoices(activeFilter)}
                        sorters={makeChoices(activeSorter)}
                        localState={this.activeTaskFilterState} 
                        accessibilityLabel={"overdue-picker"}
                    ></SidescrollPicker>
                    <ConnectedTaskList
                        navigation={this.navigation}
                        parentId={this.navigation.getParam('id', '')}
                        type={"parent-active"}
                        paginate={4}
                        onSwipeRight={(id: string) => {
                            this.onTaskAction(id, "complete")
                        }}
                        emptyText={"No active subtasks"}
                        onTaskAction={this.onTaskAction}
                        provider={this.activeTaskFilterState}
                    ></ConnectedTaskList>
                    <BackgroundTitle title={`Inactive (${this.state.inactiveCount})`}
                        style={{
                        }}
                    ></BackgroundTitle>
                    <SidescrollPicker
                        label={`Inactive (${this.state.inactiveCount})`}
                        filters={makeChoices(inactiveFilter)}
                        sorters={makeChoices(inactiveSorter)}
                        localState={this.inactiveTaskFilterState} 
                        accessibilityLabel={"overdue-picker"}
                    ></SidescrollPicker>
                    <ConnectedTaskList
                        navigation={this.navigation}
                        parentId={this.navigation.getParam('id', '')}
                        type={"parent-inactive"}
                        onTaskAction={this.onTaskAction}
                        paginate={4}
                        emptyText={"No inactive subtasks"}
                        provider={this.inactiveTaskFilterState}
                    ></ConnectedTaskList>
                </ScrollView>
                <Modal
                    visible={this.state.showAdd}
                    onRequestClose={() => {
                        this.setState({
                            showAdd: false,
                        })
                    }}
                >
                        <ModalRow
                            text={"Task"}
                            iconType={"task"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.navigation.push("AddTask", {
                                    id: "",
                                    parent_id: this.navigation.getParam("id", ""),
                                    parent_type: TaskParentTypes.TASK,
                                })
                                this.setState({
                                    showAdd: false,
                                })
                            }}
                            accessibilityLabel={"add-task-button"}
                            key={"add"}
                        ></ModalRow>
                </Modal>
            </DocumentView>
        );

    }

    renderSummary = () => {
        if(this.state.task) {
            return (
                <ConnectedTaskSummary
                    navigation={this.navigation}
                    task={this.state.task} 
                    onModalChoice={this.onModalChoice}
                ></ConnectedTaskSummary>
            );
        }
    }
}