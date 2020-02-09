
import React from "react";
import { RowView, ColumnView, HeaderText, TouchableView } from "src/Components/Basic/Basic";
import { 
    LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, Styles, 
    TEXT_VERTICAL_MARGIN, RIGHT_SECOND_MARGIN, TEXT_GREY,
    PLACEHOLDER_GREY,
    CONTAINER_VERTICAL_MARGIN,
} from "src/Components/Styled/Styles";
import { StyleProp, Button, ViewStyle, TextInput as Input, Text } from "react-native";
import MyDate from "src/common/Date";
import { Icon } from "react-native-elements";
import Modal from "src/Components/Styled/Modal";
import DateTimePicker from "src/Components/Inputs/DateTimePicker";

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
                    paddingLeft: LEFT_SECOND_MARGIN,
                    paddingRight: RIGHT_SECOND_MARGIN,
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                    marginTop: 0,
                }, this.props.style]}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                <ColumnView style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    borderColor: this.props.underlineColor ? this.props.underlineColor : TEXT_GREY,
                    borderBottomWidth: 1,
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
                name={"chevron-right"}
                type={"feather"}
                color={TEXT_GREY}
                size={20}
                style={{
                }}
            ></Icon>
        );
    }
}