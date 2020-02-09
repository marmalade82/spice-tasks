
import React from "react";
import { View, Text, TextInput as TInput, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ColumnView } from "src/Components/Basic/Basic";
import Input from "src/Components/Inputs/base/Input";
import { Label, TextInput } from "src/Components/Styled/Styled";
import { CONTAINER_VERTICAL_MARGIN } from "src/Components/Styled/Styles";

interface Props {
    title: string;
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void;
    accessibilityLabel: string;
    style?: StyleProp<ViewStyle>;
}

interface State {

}


export default class StringInput extends Input<Props, State> {
    constructor(props: Props) {
        super(props);
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
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    onChangeText={this.props.onChangeText}
                    accessibilityLabel={this.props.accessibilityLabel}
                >

                </TextInput>
            </ColumnView>
        )
    }

}