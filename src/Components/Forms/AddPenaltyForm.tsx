
import React from "react";
import {
    StringInput,
    DateTimeInput,
} from "src/Components/Inputs";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import DataComponent from "src/Components/base/DataComponent";
import Style from "src/Style/Style"
import { ColumnView } from "src/Components/Basic/Basic";
import { ScreenHeader } from "src/Components/Styled/Styled";

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
        expire_date: new Date(),
    };
}

export default class AddPenaltyForm extends DataComponent<Props, State, State> {
    constructor(props: Props) {
        super(props);

        this.state = Default();
    }

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
                <StringInput
                    title={"Name"} 
                    data={this.data().name}
                    placeholder={"Name of this penalty"}
                    onDataChange={this.onChangeName}
                    accessibilityLabel={"penalty-name"}
                />

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
                    value={this.data().expire_date}
                    onValueChange={this.onChangeExpire}
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