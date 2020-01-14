
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Style from "src/Style/Style";
import Input from "src/Components/Inputs/base/Input";

interface Props {
    title: string;
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void;
    accessibilityLabel: string;
}

interface State {

}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "stretch",
        borderColor: "grey",
        borderWidth: 1,
    },
    text: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        flex: 2,
        justifyContent: "center",
        alignItems: "stretch",
    },
});

export default class StringInput extends Input<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <View style={[localStyle.container, Style.maxInputHeight]}>
                <View style={[Style.yellowBg, localStyle.text]}>
                    <Text>{this.props.title}</Text>
                </View>
                <View style={[Style.whiteBg, localStyle.input]}>
                    <TextInput
                        value={this.props.value} 
                        placeholder={this.props.placeholder}
                        onChangeText={this.props.onChangeText}
                        accessibilityLabel={"input-" + this.props.accessibilityLabel}
                    >
                    </TextInput>
                </View>
            </View>
        )
    }

}