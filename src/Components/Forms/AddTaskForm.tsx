
import React from "react";
import {
    StringInput,
    DateTimeInput,

} from "src/Components/Inputs";
import { View } from "react-native";

interface Props {

}

interface State {
    name: string
    description: string
    start_date: Date
    due_date: Date
}

export default class AddTaskForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            name: "Bob",
            description: "I am a description",
            start_date: new Date(),
            due_date: new Date(),
        }
    }

    onChangeName = (name: string) => {
        this.setState({
            name: name
        });
    }

    onChangeDescription = (desc: string) => {
        this.setState({
            description: desc
        });
    }

    onChangeStart = (date: Date) => {
        this.setState({
            start_date: date
        });
    }

    onChangeDue = (date: Date) => {
        this.setState({
            due_date: date
        });
    }

    render = () => {
        return (
            <View>
                <StringInput
                    title={"Name"} 
                    value={this.state.name}
                    placeholder={"Name of this task"}
                    onChangeText={this.onChangeName}
                />

                <StringInput
                    title={"Description"}
                    value={this.state.description}
                    placeholder={"Description of this task"}
                    onChangeText={this.onChangeDescription}
                />

                <DateTimeInput
                    title={"Starts on"}
                    type={"date"}
                    value={this.state.start_date}
                    onValueChange={this.onChangeStart}
                />

                <DateTimeInput
                    title={"Due on"}
                    type={"date"} 
                    value={this.state.due_date}
                    onValueChange={ this.onChangeDue }
                />

            </View>
        );
    }
}