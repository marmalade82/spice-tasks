import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddTaskForm, AddTaskData, AddTaskDefault } from "src/Components/Forms/AddTaskForm";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { TaskQuery, Task } from "src/Models/Task/TaskQuery";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";

interface Props {
    navigation: any;
}

interface State { 
    data: AddTaskData;
    task?: Task;
}

const localStyle = StyleSheet.create({
    container: {
    }
});

export default class AddTaskScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            data: AddTaskDefault(),
        }
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
                    />
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
                ></AddTaskForm>
        );
    }
}