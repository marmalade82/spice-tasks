import React from "react";
import {
    StringInput,
    DateTimeInput,
} from "src/Components/Inputs";
import { Props as StringInputProps } from "src/Components/Inputs/StringInput";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import DataComponent from "src/Components/base/DataComponent";
import { Validate } from "src/Components/Inputs/Validate";
import { ColumnView } from "../Basic/Basic";
import { dueDate } from "./common/utils";
import MyDate from "src/common/Date";

interface Props {
    data: State | false
    onDataChange: (d: State) => void;
    style: StyleProp<ViewStyle>;
}

interface State {
    name: string
    details: string
    expire_date: Date
}

function Default(): State {
    return {
        name: "",
        details: "",
        expire_date: dueDate(MyDate.Now().toDate()),
    };
}

export function ValidateRewardForm(form: AddRewardForm) {

    const state = form.data();
    let error = form.validateName(state.name);
    if(error !== undefined) {
        return error;
    }

    return undefined;
}

export default class AddRewardForm extends DataComponent<Props, State, State> {
    NameInput = Validate<string, StringInputProps>(
                    StringInput,
                    (s: string) => this.validateName(s),
                    (s: string) => this.validateName(s),
    )

    constructor(props: Props) {
        super(props);

        this.state = Default();
    }

    /****************************
     * Validation functions
     */
    validateName = (s: string) => {
        return s.length > 0 ? undefined : "Please enter a name";
    }

    /***************************
     * Event handling
     */

    onChangeName = (name: string) => {
        this.setData({
            name: name
        });
    }

    onChangeDetails = (details: string) => {
        this.setData({
            details: details
        });
    }

    onChangeExpire = (date: Date) => {
        this.setData({
            expire_date: dueDate(date)
        });
    }

    render = () => {
        const NameInput = this.NameInput;
        return (
            <ColumnView style={[{
                backgroundColor: "transparent",
            }, this.props.style]}>
                <NameInput
                    title={"Name"} 
                    data={this.data().name}
                    placeholder={"Name of this reward"}
                    onValidDataChange={this.onChangeName}
                    onInvalidDataChange={this.onChangeName}
                    accessibilityLabel={"reward-name"}
                ></NameInput>

                <StringInput
                    title={"Details"}
                    data={this.data().details}
                    placeholder={"Description of this reward"}
                    onDataChange={this.onChangeDetails}
                    accessibilityLabel={"reward-description"}
                />

                <DateTimeInput
                    title={"Expires on"}
                    type={"date"}
                    data={this.data().expire_date}
                    onDataChange={this.onChangeExpire}
                    accessibilityLabel={"reward-expire-date"}
                />
            </ColumnView>
        );
    }
}

export {
    AddRewardForm,
    State as AddRewardData,
    Default as AddRewardDefault,
}