
import React from "react";
import { RowView, ColumnView, HeaderText, TouchableView } from "src/Components/Basic/Basic";
import { 
    LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, Styles, 
    TEXT_VERTICAL_MARGIN, RIGHT_SECOND_MARGIN, TEXT_GREY,
    PLACEHOLDER_GREY,
    CONTAINER_VERTICAL_MARGIN, PRIMARY_COLOR, ICON_CONTAINER_WIDTH, TEXT_HORIZONTAL_MARGIN,
} from "src/Components/Styled/Styles";
import Modal from "src/Components/Styled/Modal";
import ModalRow from "src/Components/Styled/ModalRow";
import { StyleProp, ViewStyle, TextInput as Input, Picker, Text } from "react-native";
import { Icon } from "react-native-elements";
import { Observable } from "rxjs";
import { View } from "react-native";
import { Icon as StyledIcon } from "./Icon";

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
        return (
            <RowView style={[{
                    flex: 0,
                    backgroundColor: "transparent",
                    paddingLeft: LEFT_FIRST_MARGIN,
                    paddingRight: RIGHT_SECOND_MARGIN,
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                    marginTop: 0,
                }, this.props.style]}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                {this.renderLeftIcon()}
                <ColumnView style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    borderColor: this.props.underlineColor ? this.props.underlineColor : TEXT_GREY,
                    borderBottomWidth: 1,
                    marginLeft: TEXT_HORIZONTAL_MARGIN,
                }}>

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
        if (this.props.value) {
            return (
                <Text
                    style={[Styles.HEADER_5, {
                            marginBottom: 3,
                            color: this.props.textColor ? this.props.textColor : TEXT_GREY,
                        }]
                    }
                >
                    {this.renderChoice()}
                </Text>
            );
        } else if (this.props.placeholder) {
            return (
                <Text
                    style={[Styles.HEADER_5, {
                        marginBottom: 3,
                        color: this.props.placeholderColor ? this.props.placeholderColor : TEXT_GREY,
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
        return (
            <Icon
                name={"chevron-right"}
                type={"feather"}
                color={TEXT_GREY}
                size={20}
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

    renderLeftIcon = () => {
        if(this.props.icon) {
            return(
                <StyledIcon
                    type={this.iconType()}
                    backgroundColor={"transparent"}
                    color={PRIMARY_COLOR}
                    accessibilityLabel={this.props.accessibilityLabel ? "mandatory-" + this.props.accessibilityLabel : "mandatory"}
                ></StyledIcon>
            )    
        } else {
            return (
                <View
                    style={{
                        flex: 0,
                        height: ICON_CONTAINER_WIDTH,
                        width: ICON_CONTAINER_WIDTH,
                        backgroundColor:"transparent"
                    }}
                ></View>
            )
        }

    }

}