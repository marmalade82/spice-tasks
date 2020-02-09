import React from "react";
import { View, Text, Picker, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Style from "src/Style/Style";
import Input from "src/Components/Inputs/base/Input";
import { ColumnView } from "src/Components/Basic/Basic";
import { Label, ChoiceInput as CInput } from "src/Components/Styled/Styled";


interface LabelValue {
    label: string,
    value: string,
    key: string,
}

interface Props {
    title: string;
    selectedValue: string;
    choices: LabelValue[]
    onValueChange: (itemValue: string, itemPosition: number) => void
    accessibilityLabel: string;
    style?: StyleProp<ViewStyle>;
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
    picker: {
        flex: 2,
        justifyContent: "center",
        alignItems: "stretch",
    },
});

export default class ChoiceInput extends Input<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <ColumnView style={[{
                    backgroundColor: "transparent",
                }, this.props.style]}
            >
                <Label
                    text={this.props.title} 
                ></Label>
                <CInput
                    value={this.props.selectedValue}
                    choices={this.props.choices}
                    onValueChange={this.props.onValueChange}
                    accessibilityLabel={this.props.accessibilityLabel}
                ></CInput>
            </ColumnView>
        )

        return (
            <View style={[localStyle.container, Style.maxInputHeight]}>
                <View style={[Style.yellowBg, localStyle.text]}>
                    <Text>{this.props.title}</Text>
                </View>
                <View style={[Style.whiteBg, localStyle.picker]}>
                    <Picker
                        selectedValue={this.props.selectedValue}
                        onValueChange={this.props.onValueChange}
                        accessibilityLabel={"input-" + this.props.accessibilityLabel}
                    >
                        {this.renderChoices(this.props.choices)}
                    </Picker>
                </View>
            </View>  
        );
    }

    renderChoices = (choices: LabelValue[]) => {
        return choices.map((choice: LabelValue) => {
            return (
                <Picker.Item label={choice.label} value={choice.value} key={choice.key}/>
            );
        })
    }

}