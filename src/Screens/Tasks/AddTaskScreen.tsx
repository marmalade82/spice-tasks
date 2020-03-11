import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddTaskForm, AddTaskData, AddTaskDefault, ValidateTaskForm } from "src/Components/Forms/AddTaskForm";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { TaskQuery, Task } from "src/Models/Task/TaskQuery";
import { DocumentView, ScreenHeader, Toast, IconButton } from "src/Components/Styled/Styled";
import { of } from "rxjs";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { TaskParentTypes } from "src/Models/Task/Task";
import SaveButton from "src/Components/Basic/SaveButton";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderSaveButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";

interface Props {
    navigation: any;
}

interface State { 
    data: AddTaskData;
    task?: Task;
    showToast: boolean;
    toast: string;
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

    taskFormRef: React.RefObject<AddTaskForm>
    constructor(props: Props) {
        super(props);
        this.state = {
            data: AddTaskDefault(),
            showToast: false,
            toast: "",
        }
        this.taskFormRef = React.createRef()
    }

    componentDidMount = async () => {
        const id = this.props.navigation.getParam('id', '');
        const task = await new TaskQuery().get(id); 
        if(task) {
            let data: AddTaskData = {
                name: task.title,
                start_date: task.startDate,
                due_date: task.dueDate,
                description: task.instructions,
            }
            let parentGoal = await new GoalQuery().get(task.parentId);

            if(parentGoal) {
                data.start_date = parentGoal.startDate;
                data.due_date = parentGoal.dueDate;
            }

            this.setState({
                task: task,
                data: data,
            })

        } else {
            this.setState({
                task: undefined
            })
        }

        dispatcher.addEventListener(getKey(this.props.navigation), this.onSave);
    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.props.navigation), this.onSave);
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
            const parentId = this.state.task ? this.state.task.parentId : this.props.navigation.getParam('parent_id', '');
            const parentType: TaskParentTypes | string = this.state.task ? 
                                this.state.task.parentType : 
                                this.props.navigation.getParam('parent_type', TaskParentTypes.TASK);

            if(parentType !== TaskParentTypes.GOAL && parentType !== TaskParentTypes.TASK) {
                throw new Error("Invalid parent type for a task");
            } 
            
            const data = this.state.data;
            const taskData = {
                title: data.name,
                dueDate: data.due_date,
                startDate: data.start_date,
                instructions: data.description,
                parentId: parentId,
                parentType: parentType,
            };

            if(this.state.task) {
                void (new TaskQuery().update(this.state.task, taskData)).catch();        
            } else {
                void new TaskQuery().create(taskData).catch();
            }

            this.props.navigation.goBack();
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

    renderTaskForm = () => {
        return (
                <AddTaskForm
                    data={this.state.data}
                    onDataChange={(d: AddTaskData) => {
                        this.setState({
                            data: d
                        });
                    }}
                    style={{}}
                    ref={this.taskFormRef}
                ></AddTaskForm>
        );
    }
}