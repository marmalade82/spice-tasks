import React from "react";
import {
    StringInput,
    DateTimeInput,
} from "src/Components/Inputs";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import DataComponent from "src/Components/base/DataComponent";
import Style from "src/Style/Style"
import { ColumnView } from "../Basic/Basic";

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

export default class AddRewardForm extends DataComponent<Props, State, State> {
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
                <StringInput
                    title={"Name"} 
                    data={this.data().name}
                    placeholder={"Name of this reward"}
                    onDataChange={this.onChangeName}
                    accessibilityLabel={"reward-name"}
                />

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