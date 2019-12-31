import React from "react";
import { 
    View, Text, TextInput, StyleSheet, 
    Alert, KeyboardAvoidingView,
} from "react-native";
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
    //number: number
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
     //       number: this.props.value
        }
    }

    onChangeText = (number: string) => {
        // TODO: Write way to validate the number string to be only for numbers 

        const n = parseInt(number)
        this.props.onValueChange(n);

    }

    onEndEditing = () => {
        if (this.props.maximum !== undefined && this.props.maximum < this.props.value) {
            Alert.alert("Maximum exceeded",
                    "Please enter a number less than " + this.props.maximum.toString());
        }
        
        if (this.props.minimum !== undefined && this.props.minimum > this.props.value) {
            Alert.alert("Minimum not met", 
                    "Please enter a number greater than " + this.props.minimum.toString());

        }
    }

    onBlur = () => {
        Alert.alert("hello", "hello");
    }

    value = () => {
        if(isNaN(this.props.value)) {
            return '';
        }

        return this.props.value.toString()
    }

    render = () => {
        return (
            <View style={[localStyle.container, Style.maxInputHeight]}>
                <View style={[Style.yellowBg, localStyle.text]}>
                    <Text>{this.props.title}</Text>
                </View>
                <View style={[Style.whiteBg, localStyle.input]}>
                    <TextInput
                        value={this.value()} 
                        onChangeText={this.onChangeText}
                        keyboardType={"number-pad"}
                        onEndEditing={this.onEndEditing}
                    />
                </View>
            </View>
        );
    }
}