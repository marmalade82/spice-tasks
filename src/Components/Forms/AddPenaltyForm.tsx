
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

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start"
    }
})

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
            <View style={[Style.container, localStyle.container, this.props.style]}>
                <StringInput
                    title={"Name"} 
                    value={this.data().name}
                    placeholder={"Name of this penalty"}
                    onChangeText={this.onChangeName}
                    accessibilityLabel={"penalty-name"}
                />

                <StringInput
                    title={"Details"}
                    value={this.data().details}
                    placeholder={"Description of this penalty"}
                    onChangeText={this.onChangeDetails}
                    accessibilityLabel={"penalty-description"}
                />

                <DateTimeInput
                    title={"Expires on"}
                    type={"date"}
                    value={this.data().expire_date}
                    onValueChange={this.onChangeExpire}
                    accessibilityLabel={"penalty-expire-date"}
                />
            </View>
        );
    }
}

export {
    AddPenaltyForm,
    State as AddPenaltyData,
    Default as AddPenaltyDefault,
}