import React from "react";
import { 
    View, Text, StyleSheet, 
    Alert, KeyboardAvoidingView, StyleProp, ViewStyle,
} from "react-native";
import { TextInput, Label } from "src/Components/Styled/Styled";
import Style from "src/Style/Style";
import StringInput from "./StringInput";
import { ColumnView } from "../Basic/Basic";
import { CONTAINER_VERTICAL_MARGIN } from "../Styled/Styles";

interface Props {
    title: string
    value: number
    type: "integer" | "float" | "both"
    minimum?: number
    maximum?: number
    precision?: number
    onValueChange: (n: number) => void
    accessibilityLabel: string;
    style?: StyleProp<ViewStyle>;
}

interface State {
    //number: number
}

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
            <ColumnView style={[{
                flex: 0,
                justifyContent: "flex-start",
                backgroundColor: "transparent",
                marginBottom: 2 * CONTAINER_VERTICAL_MARGIN,
            }, this.props.style]}>
                <Label text={this.props.title}></Label>
                <TextInput
                    value={this.value()} 
                    onChangeText={this.onChangeText}
                    keyboardType={"number-pad"}
                    onEndEditing={this.onEndEditing}
                    accessibilityLabel={this.props.accessibilityLabel}
                />
            </ColumnView>
        );
    }
}