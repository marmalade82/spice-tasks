
import React from "react";
import { RowView, ColumnView, HeaderText, TouchableView } from "src/Components/Basic/Basic";
import { Layout, Type, StyleSheetContext } from "src/Components/Styled/StyleSheets";
import Modal from "src/Components/Styled/Modal";
import ModalRow from "src/Components/Styled/ModalRow";
import { StyleProp, ViewStyle, TextInput as Input, Picker, Text } from "react-native";
import { Icon } from "react-native-elements";


interface Props {
    style?: StyleProp<ViewStyle>
    underlineColor?: string;
    placeholder?: string;
    placeholderColor?: string;
    textColor?: string;
    value: string;
    choices: LabelValue[]
    accessibilityLabel?: string;
    onValueChange: (itemValue: string, itemPosition: number) => void
}

interface LabelValue {
    label: string,
    value: string,
    key: string,
}

interface State {
    showModal: boolean;
}


export default class ChoiceInput extends React.Component<Props, State> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: Props) {
        super(props);

        this.state = {
            showModal: false,
        }
    }

    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <RowView style={[Class.ChoiceInput_Container, this.props.style]}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                <ColumnView style={[{
                    ...Class.ChoiceInput_InputDecorator,
                    ...(this.props.underlineColor && { borderColor: this.props.underlineColor })
                }]}>

                    <TouchableView style={{
                            flex: 1,
                        }}
                        onPress={() => {
                            this.setState({
                                showModal: true,
                            })
                        }}
                        accessibilityLabel={this.props.accessibilityLabel}
                    >
                        <RowView style={{
                                ...Class.ChoiceInput_InputContainer,
                            }}
                        >
                            {this.renderText()}
                            {this.renderIcon()}
                        </RowView>
                    </TouchableView>
                    <Modal
                        visible={this.state.showModal}
                        onRequestClose={() => {
                            this.setState({
                                showModal: false,
                            })
                        }}
                        accessibilityLabel={this.props.accessibilityLabel}
                    >
                        {this.renderChoices(this.props.choices)}
                    </Modal>
                </ColumnView>
            </RowView>
        );
    }
    renderText = () => {
        const { Class, Common, Custom } = this.context;
        if (this.props.value) {
            return (
                <Text
                    style={[Type.HEADER_5, Class.TextInputType, {
                        ...(this.props.placeholderColor && { color: this.props.placeholderColor })
                        }]
                    }
                >
                    {this.renderChoice()}
                </Text>
            );
        } else if (this.props.placeholder) {
            return (
                <Text
                    style={[Type.HEADER_5, Class.TextInputType, {
                        ...(this.props.placeholderColor && { color: this.props.placeholderColor })
                    }]}
                >
                    {this.props.placeholder}
                </Text>
            )
        } else {
            return (
                <Text></Text>
            )
        }
    }

    private renderChoice = () => {
        const result = 
            this.props.choices.find((val) => {
                return val.value === this.props.value;
            })
        if (result) {
            return result.label;
        }

        return "";
    }

    private renderIcon = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <Icon
                name={"chevron-right"}
                type={"feather"}
                {...Custom.ChoiceInput_Icon}
                style={{
                }}
            ></Icon>
        );
    }

    renderChoices = (choices: LabelValue[]) => {
        return choices.map((choice: LabelValue, index: number) => {
            return (
                <ModalRow
                    text={choice.label}
                    onPress={() => {
                        this.setState({
                            showModal: false,
                        })
                        this.props.onValueChange(choice.value, index);
                    }}
                    accessibilityLabel={
                        choice.value +
                        (this.props.accessibilityLabel ? ("-" + this.props.accessibilityLabel) : "")
                    }
                    iconType={"none"}
                    key={choice.value}
                ></ModalRow>
            );
        })
    }

}