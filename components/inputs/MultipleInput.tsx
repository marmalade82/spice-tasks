import React from "react";
import { View , Text } from "react-native";
import { number } from "prop-types";
import MultipleInputChoice from "./MultipleInputChoice";



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

    renderChoices = () => {
        this.props.choices.map((lv, index) => {
            return (
                <MultipleInputChoice
                    title={lv.label} 
                    checked={this.getChecked(this.state.selected, index)}
                    onCheck={(val: boolean) => { this.check(index, val)}}
                >
                </MultipleInputChoice>
            );
        });
    }

    render = () => {
        return (
            <View>
                <View>
                    <Text>{this.props.title}</Text>
                </View>
                <View>
                    {this.renderChoices}
                </View>
            </View>
        );
    }
}