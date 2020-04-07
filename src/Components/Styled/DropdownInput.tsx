import React from "react";
import { View, ViewStyle, StyleProp, Button, Modal } from "react-native";
import { BodyText, TouchableView } from "../Basic/Basic";
import { TEXT_VERTICAL_MARGIN, TEXT_HORIZONTAL_MARGIN, BORDER_GREY, BACKGROUND_GREY, MODAL_ROW_HEIGHT } from "./Styles";
import { TouchableWithoutFeedback, findNodeHandle } from "react-native";
import Dropdown from "src/Components/Styled/Dropdown";
import { TextInput } from "react-native-gesture-handler";
//import {DropdownInput as Dropdown} from "src/Components/Styled/DropDown";


interface LabelValue<Choices> {
    label: string;
    value: Choices;
    key: string;
}

interface Props<Choices> {
    choices: LabelValue<Choices>[]
    onPick: (choice: Choices) => void;
    pick: Choices
    style?: StyleProp<ViewStyle>
    accessibilityLabel: string;
}

interface State {
}

const height = MODAL_ROW_HEIGHT - 8;
const width = 120;

export class DropdownInput<Choices> extends React.Component<Props<Choices>, State> {
    constructor(props: Props<Choices>) {
        super(props);

        this.state = {
        };

    }

    componentDidMount = () => {
    }


    render = () => {
        return (
                <View
                    style={[{
                        flex: 0,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        backgroundColor: "transparent",
                    }, this.props.style]}
                    accessibilityLabel={this.props.accessibilityLabel}
                >
                    {this.renderAbsoluteChoices()}
                    <TextInput
                        onChangeText={(val) => {
                            let choice = this.props.choices.find((choice) => {
                                return choice.label === val;
                            })

                            if(choice) {
                                this.props.onPick(choice.value);
                            } else {
                                this.props.onPick(this.props.pick)
                            }
                        }}
                        accessibilityLabel={"value-input-" + this.props.accessibilityLabel}
                    ></TextInput>
                </View>
        );
    }

    private choiceLabels = () => {
        return this.props.choices.map((choice) => {
            return choice.label;
        })
    }

    private renderAbsoluteChoices = () => {
        return (
            <Dropdown
                height={height}
                width={width}
                choices={this.choiceLabels()}
                current={this.props.pick as unknown as string}
                onChange={(val) => {
                    let choice = this.props.choices.find((choice) => {
                        return choice.label === val;
                    })

                    if(choice) {
                        this.props.onPick(choice.value);
                    } else {
                        this.props.onPick(this.props.pick)
                    }
                }}
            >
            </Dropdown>
        )
    }
}
