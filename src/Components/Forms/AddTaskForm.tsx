
import React from "react";
import {
    StringInput,
    DateTimeInput,

} from "src/Components/Inputs";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import DataComponent from "src/Components/base/DataComponent";
import Style from "src/Style/Style"

interface Props {
    data: State | false
    onDataChange: (d: State) => void;
    style: StyleProp<ViewStyle>;
}

interface State {
    name: string
    description: string
    start_date: Date
    due_date: Date
}

function Default(): State {
    return {
        name: "",
        description: "",
        start_date: new Date(),
        due_date: new Date(),
    };
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start"
    }
})

export default class AddTaskForm extends DataComponent<Props, State, State> {
    constructor(props: Props) {
        super(props);

        this.state = Default();
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
            <View style={[Style.container, localStyle.container, this.props.style]}>
                <StringInput
                    title={"Name"} 
                    value={this.data().name}
                    placeholder={"Name of this task"}
                    onChangeText={this.onChangeName}
                    accessibilityLabel={"task-name"}
                />

                <StringInput
                    title={"Description"}
                    value={this.data().description}
                    placeholder={"Description of this task"}
                    onChangeText={this.onChangeDescription}
                    accessibilityLabel={"task-description"}
                />

                <DateTimeInput
                    title={"Starts on"}
                    type={"date"}
                    value={this.data().start_date}
                    onValueChange={this.onChangeStart}
                    accessibilityLabel={"task-start-date"}
                />

                <DateTimeInput
                    title={"Due on"}
                    type={"date"} 
                    value={this.data().due_date}
                    onValueChange={ this.onChangeDue }
                    accessibilityLabel={"task-due-date"}
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