import React from "react";
import { 
    View, Text, StyleSheet, 
    Alert, KeyboardAvoidingView, StyleProp, ViewStyle,
} from "react-native";
import { TextInput, Label } from "src/Components/Styled/Styled";
import Style from "src/Style/Style";
import StringInput from "./StringInput";
import { ColumnView } from "../Basic/Basic";
import { Layout, Type, Class } from "src/Components/Styled/StyleSheets";

export interface Props {
    title: string
    data: number
    type: "integer" | "float" | "both"
    minimum?: number
    maximum?: number
    precision?: number
    onDataChange: (n: number) => void
    accessibilityLabel: string;
    style?: StyleProp<ViewStyle>;
    onBlur?: () => void;
    success?: boolean;
    failure?: string;
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

    private onChangeText = (number: string) => {
        // TODO: Write way to validate the number string to be only for numbers 
        
        let n = parseInt(number)
        if(isNaN(n)) {
            n = 0;
        }
        this.props.onDataChange(n);

    }

    private onEndEditing = () => {
        if (this.props.maximum !== undefined && this.props.maximum < this.props.data) {
            Alert.alert("Maximum exceeded",
                    "Please enter a number less than " + this.props.maximum.toString());
        }
        
        if (this.props.minimum !== undefined && this.props.minimum > this.props.data) {
            Alert.alert("Minimum not met", 
                    "Please enter a number greater than " + this.props.minimum.toString());

        }
    }

    private onBlur = () => {
        Alert.alert("hello", "hello");
    }

    value = () => {
        if(isNaN(this.props.data)) {
            return '';
        }

        return this.props.data.toString()
    }

    icon = () => {
        if(this.props.failure !== undefined) {
            return "attention";
        }
    }

    render = () => {

        return (
            <ColumnView style={[Class.InputContainer, this.props.style]}>
                <Label text={this.props.title}></Label>
                <TextInput
                    value={this.value()} 
                    onChangeText={this.onChangeText}
                    keyboardType={"number-pad"}
                    onEndEditing={this.onEndEditing}
                    accessibilityLabel={this.props.accessibilityLabel}
                    onBlur={this.props.onBlur}
                    icon={this.icon()}
                />
            </ColumnView>
        );
    }
}