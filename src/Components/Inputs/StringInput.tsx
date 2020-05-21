
import { Layout, Type, StyleSheetContext } from "src/Components/Styled/StyleSheets";
import React from "react";
import { View, Text, TextInput as TInput, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ColumnView } from "src/Components/Basic/Basic";
import Input from "src/Components/Inputs/base/Input";
import { Label, TextInput } from "src/Components/Styled/Styled";

export interface Props {
    title: string;
    data: string;
    placeholder: string;
    onDataChange: (text: string) => void;
    accessibilityLabel: string;
    style?: StyleProp<ViewStyle>;
    multiline?: boolean;
    success ? : boolean;
    failure ? : string;
    onBlur?: () => void;
}

interface State {

}


export default class StringInput extends Input<Props, State> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: Props) {
        super(props);
    }

    icon = () => {
        if(this.props.failure !== undefined) {
            return "attention";
        }
    }

    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <ColumnView style={[Class.InputContainer, this.props.style]}>
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