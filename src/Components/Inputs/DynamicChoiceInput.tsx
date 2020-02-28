
import React from "react";
import { View, Text, Picker, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Style from "src/Style/Style";
import Input from "src/Components/Inputs/base/Input";
import { ColumnView } from "src/Components/Basic/Basic";
import { Label, DynamicChoiceInput as CInput } from "src/Components/Styled/Styled";
import { CONTAINER_VERTICAL_MARGIN } from "src/Components/Styled/Styles";
import { Observable } from "rxjs";


interface LabelValue {
    label: string,
    value: string,
    key: string,
}

export interface Props {
    title: string;
    data: string;
    choices: Observable<LabelValue[]>
    onDataChange: (itemValue: string, itemPosition?: number) => void
    accessibilityLabel: string;
    style?: StyleProp<ViewStyle>;
    success ? : boolean;
    failure ? : string;
    onBlur?: () => void;
}

export interface State {

}

export default class DynamicChoiceInput extends Input<Props, State> {

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
                }, this.props.style]}
            >
                <Label
                    text={this.props.title} 
                ></Label>
                <CInput
                    value={this.props.data}
                    choices={this.props.choices}
                    onValueChange={this.props.onDataChange}
                    accessibilityLabel={this.props.accessibilityLabel}
                    onBlur={this.props.onBlur}
                    icon={this.icon()}
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