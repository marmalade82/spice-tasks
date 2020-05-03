import React from "react";
import { View, Text, Picker, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Style from "src/Style/Style";
import Input from "src/Components/Inputs/base/Input";
import { ColumnView } from "src/Components/Basic/Basic";
import { Label, ChoiceInput as CInput } from "src/Components/Styled/Styled";
import { Layout, Type, StyleSheetContext } from "src/Components/Styled/StyleSheets";


interface LabelValue {
    label: string,
    value: string,
    key: string,
}

interface Props {
    title: string;
    data: string;
    choices: LabelValue[]
    onDataChange: (itemValue: string, itemPosition: number) => void
    accessibilityLabel: string;
    style?: StyleProp<ViewStyle>;
}

interface State {

}

export default class ChoiceInput extends Input<Props, State> {

    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <ColumnView style={[Class.InputContainer
                , this.props.style]}
            >
                <Label
                    text={this.props.title} 
                ></Label>
                <CInput
                    value={this.props.data}
                    choices={this.props.choices}
                    onValueChange={this.props.onDataChange}
                    accessibilityLabel={this.props.accessibilityLabel}
                ></CInput>
            </ColumnView>
        )
    }

    renderChoices = (choices: LabelValue[]) => {
        return choices.map((choice: LabelValue) => {
            return (
                <Picker.Item label={choice.label} value={choice.value} key={choice.key}/>
            );
        })
    }

}