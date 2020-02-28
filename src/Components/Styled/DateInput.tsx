
import React from "react";
import { RowView, ColumnView, HeaderText, TouchableView } from "src/Components/Basic/Basic";
import { 
    LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, Styles, 
    TEXT_VERTICAL_MARGIN, RIGHT_SECOND_MARGIN, TEXT_GREY,
    PLACEHOLDER_GREY, PRIMARY_COLOR, ICON_CONTAINER_WIDTH,
    CONTAINER_VERTICAL_MARGIN,
    TEXT_HORIZONTAL_MARGIN,
} from "src/Components/Styled/Styles";
import { StyleProp, Button, ViewStyle, TextInput as TInput, Text } from "react-native";
import MyDate from "src/common/Date";
import Modal from "src/Components/Styled/Modal";
import DateTimePicker from "src/Components/Inputs/DateTimePicker";
import { View } from "react-native";
import { Icon } from "./Icon";

interface Props {
    style?: StyleProp<ViewStyle>;
    placeholder?: string;
    placeholderColor?: string;
    textColor?: string;
    underlineColor? : string;
    value: Date;
    onChangeDate: (s : Date) => void;
    accessibilityLabel?: string;
    format: "january 1st, 2020"
    onBlur?: () => void;
    icon?: "mandatory" | "attention";
}

interface State {
    modalDateTime: Date
    showModal: boolean;
}

export default class DateInput extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            modalDateTime : new Date(),
            showModal: false,
        };
    }

    iconType = (): "mandatory" | "attention" => {
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

    onChangeModalDateTime = (d: Date) => {
        this.setState({
            modalDateTime: d,
        })
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
                        height={500}
                        accessibilityLabel={this.props.accessibilityLabel}
                    >
                        <DateTimePicker
                            onChange={this.onChangeModalDateTime}
                            dateTime={this.props.value}
                            type={"date"}
                        >
                        </DateTimePicker>
                        <Button
                            title="Save"
                            onPress={() => {
                                this.setState({
                                    showModal: false,
                                });
                                this.props.onChangeDate(this.state.modalDateTime);
                            }}
                        >
                        </Button>
                    </Modal>
                    <View style={{
                        flex: 0,
                        height: 0,
                        width: 0,
                    }}>
                        <TInput
                            onChangeText={(text) => {
                                const date = new Date(text);
                                if(isFinite(date.valueOf())) {
                                    //then we have a valid date
                                    this.props.onChangeDate(date);
                                }
                            }}
                            accessibilityLabel={this.props.accessibilityLabel ? "value-input-" + this.props.accessibilityLabel : undefined}
                        ></TInput>
                    </View>
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
                    {this.renderDate()}
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

    renderLeftIcon = () => {
        if(this.props.icon) {
            let type = this.iconType();
            return(
                <Icon
                    type={type}
                    backgroundColor={"transparent"}
                    color={PRIMARY_COLOR}
                    accessibilityLabel={this.props.accessibilityLabel ? type + this.props.accessibilityLabel : type}
                ></Icon>
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

    renderDate = () => {
        const date = new MyDate(this.props.value)
        switch(this.props.format) {
            case "january 1st, 2020": {
                return date.format("MMMM Do, YYYY")
            } break;
            default: {
                return undefined
            }
        }
    }

    renderIcon = () => {
        return (
            <Icon
                type={"right"}
                backgroundColor={"transparent"}
            ></Icon>
        );
    }
}