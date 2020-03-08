
import React from "react";
import {
    StringInput,
    DateTimeInput,
} from "src/Components/Inputs";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import DataComponent from "src/Components/base/DataComponent";
import Style from "src/Style/Style"
import { ColumnView } from "src/Components/Basic/Basic";
import { Validate } from "src/Components/Inputs/Validate";
import { ScreenHeader } from "src/Components/Styled/Styled";
import { dueDate } from "./common/utils";
import { Props as StringInputProps } from "src/Components/Inputs/StringInput";

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
        expire_date: dueDate (new Date),
    };
}

export function ValidatePenaltyForm(form: AddPenaltyForm) {
    const state = form.data();
    let error = form.validateName(state.name);
    if(error !== undefined) {
        return error;
    }

    return undefined;
}

export default class AddPenaltyForm extends DataComponent<Props, State, State> {

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
            expire_date: date
        });
    }

    render = () => {
        return (
            <ColumnView style={[{
                backgroundColor: "transparent",
            }, this.props.style]}>
                <ScreenHeader>Add/Edit Penalty</ScreenHeader>
                <this.NameInput
                    title={"Name"} 
                    data={this.data().name}
                    placeholder={"Name of this penalty"}
                    onValidDataChange={this.onChangeName}
                    onInvalidDataChange={this.onChangeName}
                    accessibilityLabel={"penalty-name"}
                ></this.NameInput>

                <StringInput
                    title={"Details"}
                    data={this.data().details}
                    placeholder={"Description of this penalty"}
                    onDataChange={this.onChangeDetails}
                    accessibilityLabel={"penalty-description"}
                />

                <DateTimeInput
                    title={"Expires on"}
                    type={"date"}
                    data={this.data().expire_date}
                    onDataChange={this.onChangeExpire}
                    accessibilityLabel={"penalty-expire-date"}
                />
            </ColumnView>
        );
    }
}

export {
    AddPenaltyForm,
    State as AddPenaltyData,
    Default as AddPenaltyDefault,
}