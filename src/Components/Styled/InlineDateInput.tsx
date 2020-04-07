
import React from "react";
import { RowView, ColumnView, HeaderText, TouchableView, BodyText } from "src/Components/Basic/Basic";
import { 
    LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, Styles, 
    TEXT_VERTICAL_MARGIN, RIGHT_SECOND_MARGIN, TEXT_GREY,
    PLACEHOLDER_GREY, PRIMARY_COLOR, ICON_CONTAINER_WIDTH,
    CONTAINER_VERTICAL_MARGIN,
    TEXT_HORIZONTAL_MARGIN,
} from "src/Components/Styled/Styles";
import { StyleProp, Button, ViewStyle, TextInput as TInput, Text } from "react-native";
import { 
    View, Platform, DatePickerIOS, 
    DatePickerAndroid, TimePickerAndroid, StyleSheet
} from "react-native";
import MyDate from "src/common/Date";

interface Props {
    style?: StyleProp<ViewStyle>;
    placeholder?: string;
    placeholderColor?: string;
    textColor?: string;
    underlineColor? : string;
    value: Date;
    onChangeDate: (s : Date) => void;
    accessibilityLabel?: string;
    format: "01/31/20"
    onBlur?: () => void;
    readonly?: boolean;
}

interface State {
}

export default class InlineDateInput extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    private onPress = async () => {
        if(Platform.OS === "android") {
            await this.onPressDateAndroid();
        }
    }

    private onPressDateAndroid = async() => {
        const dateOpts = await DatePickerAndroid.open({
            date: this.props.value,
            mode: 'default',
        });

        if(dateOpts.action === DatePickerAndroid.dateSetAction) {
            let date = new Date(dateOpts.year, dateOpts.month, dateOpts.day);

            this.props.onChangeDate( new MyDate(date).prevMidnight().toDate() );
        }
    }

    render = () => {
        return (

            <RowView style={[{
                    flex: 0,
                    backgroundColor: "transparent",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginTop: 0,
                }, this.props.style]}
                accessibilityLabel={this.props.accessibilityLabel}
            >

                {this.renderTouchable()}
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
                                this.props.onChangeDate(new MyDate(date).prevMidnight().toDate());
                            }
                        }}
                        accessibilityLabel={this.props.accessibilityLabel ? "value-input-" + this.props.accessibilityLabel : undefined}
                    ></TInput>
                </View>
            </RowView>
        )
    }

    private renderTouchable = () => {
        if(this.props.readonly !== true) {
            return ( <TouchableView style={{
                    flex: 0,
                }}
                onPress={this.onPress}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                {this.renderInput()}
            </TouchableView>)
        } else {
            return this.renderInput();
        }
    }

    private renderInput = () => {
        return (
            <RowView style={{
                    flex: 0,
                    justifyContent: "space-between",
                    backgroundColor: "transparent",
                    alignItems: "flex-end",
                    paddingLeft: 3,
                    paddingRight: 7,
                    borderColor: this.props.readonly ? "transparent" : (this.props.underlineColor ? this.props.underlineColor : TEXT_GREY),
                    borderBottomWidth: 1,
                }}
            >
                {this.renderText()}
            </RowView>
        )
    }

    private renderText = () => {
        if (this.props.value) {
            return (
                <BodyText style={{}}>
                    {this.renderDate()}
                </BodyText>
                /*<Text
                    style={[Styles.HEADER_5, {
                            marginBottom: 3,
                            color: this.props.textColor ? this.props.textColor : "black",
                        }]
                    }
                >
                    {this.renderDate()}
                </Text>*/
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

    private renderDate = () => {
        const date = new MyDate(this.props.value)
        switch(this.props.format) {
            case "01/31/20": {
                return date.format("MM/DD/YY")
            } break;
            default: {
                return null
            }
        }
    }
}