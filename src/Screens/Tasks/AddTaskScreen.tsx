import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddTaskForm, AddTaskData, AddTaskDefault, ValidateTaskForm } from "src/Components/Forms/AddTaskForm";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { TaskQuery, Task } from "src/Models/Task/TaskQuery";
import { DocumentView, ScreenHeader, Toast } from "src/Components/Styled/Styled";
import { of } from "rxjs";

interface Props {
    navigation: any;
}

interface State { 
    data: AddTaskData;
    task?: Task;
    showToast: boolean;
    toast: string;
}

export default class AddTaskScreen extends React.Component<Props, State> {
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

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Task',
        }
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
            this.setState({
                task: task,
                data: data,
            })
        } else {
            this.setState({
                task: undefined
            })
        }
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
            // Parent id only changes if task does not already have a parent id.
            const parentId = this.state.task ? this.state.task.parentId : this.props.navigation.getParam('parent_id', '');
            const data = this.state.data;
            const taskData = {
                title: data.name,
                dueDate: data.due_date,
                startDate: data.start_date,
                instructions: data.description,
                parentId: parentId,
            };

            if(this.state.task) {
                (new TaskQuery().update(this.state.task, taskData)).catch();        
            } else {
                new TaskQuery().create(taskData).catch();
            }

            this.props.navigation.goBack();
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ScreenHeader>Add/Edit Task</ScreenHeader>
                <ScrollView style={{
                    backgroundColor: "transparent",
                }}>
                    { this.renderTaskForm() }
                </ScrollView>

                <Button
                    title={"SAVE"}
                    onPress={this.onSave}
                    accessibilityLabel={"input-save-button"}
                />
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