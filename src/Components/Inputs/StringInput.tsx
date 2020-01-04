
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Style from "src/Style/Style";


interface Props {
    title: string;
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void;
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

export default class StringInput extends React.Component<Props, State> {
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
                    >
                    </TextInput>
                </View>
            </View>
        )
    }

}