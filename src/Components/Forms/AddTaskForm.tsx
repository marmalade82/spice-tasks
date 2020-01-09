
import React from "react";
import {
    StringInput,
    DateTimeInput,

} from "src/Components/Inputs";
import { View } from "react-native";
import DataComponent from "src/Components/base/DataComponent";

interface Props {
    data: State | false
    onDataChange: (d: State) => void;
}

interface State {
    name: string
    description: string
    start_date: Date
    due_date: Date
}

const Default: State = {
    name: "Bob",
    description: "I am a description",
    start_date: new Date(),
    due_date: new Date(),
}

export default class AddTaskForm extends DataComponent<Props, State, State> {
    constructor(props: Props) {
        super(props);

        this.state = Default;
    }

    onChangeName = (name: string) => {
        this.setData({
            name: name
        });
    }

    onChangeDescription = (desc: string) => {
        this.setData({
            description: desc
        });
    }

    onChangeStart = (date: Date) => {
        this.setData({
            start_date: date
        });
    }

    onChangeDue = (date: Date) => {
        this.setData({
            due_date: date
        });
    }

    render = () => {
        return (
            <View>
                <StringInput
                    title={"Name"} 
                    value={this.data().name}
                    placeholder={"Name of this task"}
                    onChangeText={this.onChangeName}
                />

                <StringInput
                    title={"Description"}
                    value={this.data().description}
                    placeholder={"Description of this task"}
                    onChangeText={this.onChangeDescription}
                />

                <DateTimeInput
                    title={"Starts on"}
                    type={"date"}
                    value={this.data().start_date}
                    onValueChange={this.onChangeStart}
                />

                <DateTimeInput
                    title={"Due on"}
                    type={"date"} 
                    value={this.data().due_date}
                    onValueChange={ this.onChangeDue }
                />

            </View>
        );
    }
}

export {
    AddTaskForm,
    State as AddTaskData,
    Default as AddTaskDefault,
}