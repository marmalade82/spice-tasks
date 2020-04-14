
import React from "react";
import {
    StringInput,
    DateTimeInput,

} from "src/Components/Inputs";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import DataComponent from "src/Components/base/DataComponent";
import Style from "src/Style/Style"
import { ColumnView } from "src/Components/Basic/Basic";
import { Choices as RecurTypeChoices } from "src/Models/Recurrence/RecurLogic";
import ChoiceInput from "src/Components/Inputs/ChoiceInput";

interface Props {
    data: State | false
    onDataChange: (d: State) => void;
    style: StyleProp<ViewStyle>;
}

interface State {
    repeats: "daily" | "weekly" |"monthly"
}

function Default(): State {
    return {
        repeats: "daily",
    };
}


export default class AddRecurForm extends DataComponent<Props, State, State> {
    constructor(props: Props) {
        super(props);

        this.state = Default();
    }

    render = () => {
        return (
            <ColumnView style={[{
                backgroundColor: "transparent",
            },this.props.style]}>
                <ChoiceInput
                    title={"Repeats"}
                    data={this.data().repeats.toString()}
                    onDataChange={(itemValue, itemIndex) => {
                        this.setData({
                            repeats: itemValue as "daily" | "weekly" | "monthly"
                        })
                    }}
                    choices={RecurTypeChoices.filter((lv) => {
                        return lv.value != "never"
                    })}
                    accessibilityLabel={"goal-repeat"}
                ></ChoiceInput>

            </ColumnView>
        );
    }
}

export {
    AddRecurForm,
    State as AddRecurData,
    Default as AddRecurDefault,
}