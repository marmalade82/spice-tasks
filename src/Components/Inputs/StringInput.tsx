
import React from "react";
import { View, Text, TextInput as TInput, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ColumnView } from "src/Components/Basic/Basic";
import Input from "src/Components/Inputs/base/Input";
import { Label, TextInput } from "src/Components/Styled/Styled";
import { CONTAINER_VERTICAL_MARGIN } from "src/Components/Styled/Styles";

export interface Props {
    title: string;
    data: string;
    placeholder: string;
    onDataChange: (text: string) => void;
    accessibilityLabel: string;
    style?: StyleProp<ViewStyle>;
    multiline?: boolean;
    success ? : string;
    failure ? : string;
    onBlur?: () => void;
}

interface State {

}


export default class StringInput extends Input<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    icon = () => {
        if(this.props.failure !== undefined) {
            return "attention";
        }
    }

    render = () => {
        return (
            <ColumnView style={[{
                flex: 0,
                backgroundColor: "transparent",
                marginBottom: 2 * CONTAINER_VERTICAL_MARGIN,
            }, this.props.style]}>
                <Label
                    text={this.props.title}
                ></Label>
                <TextInput
                    value={this.props.data}
                    placeholder={this.props.placeholder}
                    onChangeText={this.props.onDataChange}
                    accessibilityLabel={this.props.accessibilityLabel}
                    multiline={this.props.multiline}
                    onBlur={this.props.onBlur}
                    icon={this.icon()}
                >
                </TextInput>
            </ColumnView>
        )
    }

}