
import React from "react";
import { RowView, ColumnView, HeaderText, TouchableView } from "src/Components/Basic/Basic";
import Modal from "src/Components/Styled/Modal";
import ModalRow from "src/Components/Styled/ModalRow";
import { StyleProp, ViewStyle, TextInput as Input, Picker, Text } from "react-native";
import { Icon } from "react-native-elements";
import { Observable } from "rxjs";
import { View } from "react-native";
import { Icon as StyledIcon } from "./Icon";
import EmptyList, { PlusEmptyList } from "../Lists/EmptyList";
import { Layout, Type, StyleSheetContext } from "src/Components/Styled/StyleSheets";

interface Props {
    style?: StyleProp<ViewStyle>
    underlineColor?: string;
    placeholder?: string;
    placeholderColor?: string;
    textColor?: string;
    value: string;
    choices: Observable<LabelValue[]>
    accessibilityLabel?: string;
    onValueChange: (itemValue: string, itemPosition: number) => void
    onBlur?: () => void;
    icon?: "mandatory" | "attention";
    emptyType?: "earned-reward" | "earned-penalty";
    onEmptyPress?: () => void;
}

interface LabelValue {
    label: string,
    value: string,
    key: string,
}

interface State {
    showModal: boolean;
    choices: LabelValue[];
}

export default class DynamicChoiceInput extends React.Component<Props, State> {

    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    unsub: () => void;
    constructor(props: Props) {
        super(props);

        this.state = {
            showModal: false,
            choices: []
        }

        this.unsub = () => {};
    }

    componentDidMount = () => {
        const choiceSub = this.props.choices.subscribe((lv) => {
            this.setState({
                choices: lv
            });
            const result = 
                this.state.choices.find((val) => {
                    return val.value === this.props.value;
                })
            if(result === undefined && this.props.value !== "") {
                this.props.onValueChange("", -1);
            }
        })
        this.unsub = () => {
            choiceSub.unsubscribe();
        }
    }

    componentWillUnmount = () => {
        this.unsub();
    }

    componentDidUpdate = () => {

    }

    iconType = () => {
        switch(this.props.icon) {
            case "mandatory": {
                return "mandatory"
            } break;
            case "attention": {
                return "attention"
            } break;
        }

        return "attention";
    }

    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <RowView style={[Class.DynamicChoiceInput_Container, this.props.style]}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                {this.renderLeftIcon()}
                <ColumnView style={[Class.DynamicChoiceInput_Decorator, {
                    ...(this.props.underlineColor && { borderColor: this.props.underlineColor})
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
                            flex: 1,
                            justifyContent: "space-between",
                            backgroundColor: "transparent",
                            alignItems: "center",
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
                        {this.renderChoices(this.state.choices)}
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
                            ...(this.props.textColor && { color: this.props.textColor })
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
                            ...(this.props.textColor && { color: this.props.textColor })
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

    renderChoice = () => {
        const result = 
            this.state.choices.find((val) => {
                return val.value === this.props.value;
            })
        if (result) {
            return result.label;
        }

        return "";
    }

    renderIcon = () => {
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
        if(choices.length > 0) {
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
        } else if(this.props.emptyType)  {
            switch(this.props.emptyType) {
                case "earned-reward": {
                    return (
                        <PlusEmptyList
                            text={"You haven't created any rewards yet"}
                            type={"add"}
                            onPress={() => {
                                this.setState({
                                    showModal: false,
                                })
                                this.props.onEmptyPress ? this.props.onEmptyPress() : null;
                            }}
                        ></PlusEmptyList>
                    );
                } break;
                case "earned-penalty": { 
                    return (
                        <PlusEmptyList
                            text={"You haven't created any penalties yet"}
                            type={"add"}
                            onPress={() => {
                                this.setState({
                                    showModal: false,
                                })
                                this.props.onEmptyPress ? this.props.onEmptyPress() : null;
                            }}
                        ></PlusEmptyList>
                    );
                } break;
            }
        } else {
            return null;
        }
    }

    renderLeftIcon = () => {
        const { Class, Common, Custom } = this.context;
        if(this.props.icon) {
            return(
                <StyledIcon
                    type={this.iconType()}
                    {...Custom.AlertIcon}
                    accessibilityLabel={this.props.accessibilityLabel ? "mandatory-" + this.props.accessibilityLabel : "mandatory"}
                ></StyledIcon>
            )    
        } else {
            return (
                <View
                    style={{
                        ...Class.StandardIconContainer,
                        backgroundColor:"transparent"
                    }}
                ></View>
            )
        }

    }

}