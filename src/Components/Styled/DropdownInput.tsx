import React from "react";
import { View, ViewStyle, StyleProp, Button, Modal } from "react-native";
import { BodyText, TouchableView } from "../Basic/Basic";
import Dropdown from "src/Components/Styled/Dropdown";
import { TextInput } from "react-native-gesture-handler";
import { StyleSheetContext } from "./StyleSheets";
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


export class DropdownInput<Choices> extends React.Component<Props<Choices>, State> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: Props<Choices>) {
        super(props);

        this.state = {
        };

    }

    componentDidMount = () => {
    }


    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
                <View
                    style={[Class.DropdownInput_Container, this.props.style]}
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
        const { Class, Common, Custom } = this.context;
        return (
            <Dropdown
                {...Custom.DropdownInput_Dropdown}
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
