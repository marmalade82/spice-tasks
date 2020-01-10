import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddTaskForm, AddTaskData, AddTaskDefault } from "src/Components/Forms/AddTaskForm";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { GoalQuery, Goal } from "src/Models/Goal/GoalQuery";

interface Props {
    navigation: any;
}

interface State { 
    data: AddTaskData;
}

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

    render = () => {
        return (
            <View style={Style.container}>
                <AddTaskForm
                    data={this.state.data}
                    onDataChange={(d: AddTaskData) => {
                        this.setState({
                            data: d
                        });
                    }}
                    style={{}}
                ></AddTaskForm>
            </View>
        );
    }
}