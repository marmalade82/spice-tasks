import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddTaskForm, AddTaskData, AddTaskDefault, ValidateTaskForm } from "src/Components/Forms/AddTaskForm";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { TaskQuery, Task, TaskLogic } from "src/Models/Task/TaskQuery";
import { DocumentView, ScreenHeader, Toast, IconButton } from "src/Components/Styled/Styled";
import { of } from "rxjs";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { TaskParentTypes } from "src/Models/Task/Task";
import SaveButton from "src/Components/Basic/SaveButton";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderSaveButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";
import StreakCycleQuery from "src/Models/Group/StreakCycleQuery";
import { GoalType } from "src/Models/Goal/GoalLogic";

interface Props {
    navigation: object;
}

interface State { 
    data: AddTaskData;
    task?: Task;
    showToast: boolean;
    toast: string;
    dateRange?: [Date, Date];
}

const dispatcher = new EventDispatcher();

export default class AddTaskScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Task',
            right: [
                () => {
                    return (
                        <HeaderSaveButton
                            dispatcher={dispatcher}
                            eventName={getKey(navigation)}
                        ></HeaderSaveButton>
                    );
                }
            ]
        }
    }

    navigation: MainNavigator<"AddTask">
    taskFormRef: React.RefObject<AddTaskForm>
    constructor(props: Props) {
        super(props);
        this.state = {
            data: AddTaskDefault(),
            showToast: false,
            toast: "",
        }
        this.taskFormRef = React.createRef()
        this.navigation = new ScreenNavigation(props);
    }

    componentDidMount = async () => {
        const id = this.navigation.getParam('id', '');
        const task = await new TaskQuery().get(id); 
        let data = AddTaskDefault();
        if(task) {
            data = {
                name: task.title,
                start_date: task.startDate,
                description: task.instructions,
            }
        } 

        const parentType = task && task.parent ? task.parent.type : this.navigation.getParam('parent_type', TaskParentTypes.NONE);
        const parentId = task && task.parent ? task.parent.id : this.navigation.getParam('parent_id', '');
        switch(parentType) {
            case TaskParentTypes.TASK: {
                const parent = await new TaskQuery().get(parentId);
                if(parent) {
                    this.setState({
                        dateRange: [ parent.startDate, parent.dueDate ]
                    })

                    if(!task) {
                        data.start_date = parent.startDate;
                    }
                }
            } break;
            case TaskParentTypes.CYCLE: {
                const parent = await new StreakCycleQuery().get(parentId);
                if(parent) {
                    this.setState({
                        dateRange: [ parent.startDate, parent.endDate ]
                    })

                    if(!task) {
                        data.start_date = parent.startDate;
                    }
                }
            } break;
            case TaskParentTypes.GOAL: {
                const parent = await new GoalQuery().get(parentId);
                if(parent) {
                    if(parent.goalType === GoalType.NORMAL) {
                        this.setState({
                            dateRange: [ parent.startDate, parent.dueDate]
                        })
                    } else {
                        this.setState({
                            dateRange: [ parent.currentCycleStart(), parent.currentCycleEnd() ]
                        });
                    }

                    if(!task) {
                        data.start_date = parent.startDate;
                    }
                }
            } break;
            case TaskParentTypes.NONE: {
                // Do nothing
            } break;
            default: {
                // Do nothing
            }
        }

        this.setState({
            task: task ? task : undefined,
            data: data,
        })


        dispatcher.addEventListener(getKey(this.navigation), this.onSave);

    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.navigation), this.onSave);
    }

    onSave = () => {
        let message: string | undefined = undefined;
        if(this.taskFormRef.current) {
            message = ValidateTaskForm(this.taskFormRef.current);
        }

        if(message !== undefined) {
            this.setState({
                showToast: true,
                toast: message,
            });
        } else {
            // Parent id only changes if task does not already exist
            const parentId = this.state.task ? this.state.task.parent.id : this.navigation.getParam('parent_id', '');
            const parentType: TaskParentTypes | string = this.state.task ? 
                                this.state.task.parent.type : 
                                this.navigation.getParam('parent_type', TaskParentTypes.TASK);

            if(parentType !== TaskParentTypes.GOAL && parentType !== TaskParentTypes.TASK) {
                throw new Error("Invalid parent type for a task");
            } 
            
            const data = this.state.data;
            const taskData = {
                title: data.name,
                startDate: data.start_date,
                instructions: data.description,
                parentId: parentId,
                parentType: parentType,
            };

            if(this.state.task) {
                void new TaskLogic(this.state.task.id).update(taskData);
            } else {
                void TaskLogic.create(taskData);
            }

            this.navigation.goBack();
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ScrollView style={{
                    backgroundColor: "transparent",
                }}>
                    { this.renderTaskForm() }
                </ScrollView>

                <Toast
                    visible={this.state.showToast}
                    message={this.state.toast}
                    onToastDisplay={() => {
                        this.setState({
                            showToast: false
                        });
                    }}
                ></Toast>
            </DocumentView>
        );
    }

    private renderTaskForm = () => {
        return (
                <AddTaskForm
                    data={this.state.data}
                    onDataChange={(d: AddTaskData) => {
                        this.setState({
                            data: d
                        });
                    }}
                    style={{}}
                    dateRange={this.state.dateRange}
                    ref={this.taskFormRef}
                ></AddTaskForm>
        );
    }
}

