import React from "react";
import { View, Text, Picker, StyleSheet } from "react-native";
import Style from "src/Style/Style";


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

export default class ChoiceInput extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <View style={[localStyle.container, Style.maxInputHeight]}>
                <View style={[Style.yellowBg, localStyle.text]}>
                    <Text>{this.props.title}</Text>
                </View>
                <View style={[Style.whiteBg, localStyle.picker]}>
                    <Picker
                        selectedValue={this.props.selectedValue}
                        onValueChange={this.props.onValueChange}
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