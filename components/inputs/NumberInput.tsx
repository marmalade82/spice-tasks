import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Style from "../../styles/Style";

interface Props {
    title: string
    value: number
    type: "integer" | "float" | "both"
    minimum?: number
    maximum?: number
    precision?: number
    onValueChange: (n: number) => void
}

interface State {
    number: number
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

export default class NumberInput extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            number: this.props.value
        }
    }

    onChangeText = (number: string) => {
        // TODO: Write way to validate the number string to be only for numbers 
    }

    render = () => {
        return (
            <View style={[localStyle.container, Style.maxInputHeight]}>
                <View style={[Style.yellowBg, localStyle.text]}>
                    <Text>{this.props.title}</Text>
                </View>
                <View style={[Style.whiteBg, localStyle.input]}>
                    <TextInput
                        value={this.props.value.toString()} 
                        onChangeText={this.onChangeText}
                    >
                    </TextInput>
                </View>
            </View>
        );
    }
}