import React from "react";
import { View , Text, StyleSheet } from "react-native";
import MultipleInputChoice from "./MultipleInputChoice";
import Style from "../../styles/Style";



interface Props {
    title: string
    choices: LabelValue[]
}

interface State {
    selected: number; // bitmap of the selected choices
}

interface LabelValue {
    label: string;
    value: string;
    key: string;
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

    choices: {
        flex: 2,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
});

export default class MultipleInput extends React.Component<Props,State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selected: 0
        }
    }

    getChecked = (bitmap: number, index: number) => {
        return true;
    }

    check = (index: number, val: boolean) => {

    }

    inputChoiceStyle = () => {
        if(this.props.choices.length) {
            return { 
                maxWidth: (90 / this.props.choices.length).toString() + "%",
            }
        } else {
            return {};
        }

    }

    renderChoices = () => {
        return this.props.choices.map((lv, index) => {
            return (
                <MultipleInputChoice
                    title={lv.label} 
                    checked={this.getChecked(this.state.selected, index)}
                    onCheck={(val: boolean) => { this.check(index, val)}}
                    style={ this.inputChoiceStyle() }
                    key={lv.key}
                >
                </MultipleInputChoice>
            );
        });
    }

    render = () => {
        return (
            <View style={[localStyle.container, Style.maxInputHeight]}>
                <View style={[localStyle.text, Style.yellowBg]}>
                    <Text>{this.props.title}</Text>
                </View>
                <View style={[localStyle.choices, Style.redBg]}>
                    {this.renderChoices()}
                </View>
            </View>
        );
    }
}