
import React from "react";
import { RowView, ColumnView, HeaderText, TouchableView } from "src/Components/Basic/Basic";
import { Layout, Type, Class, Common, Custom } from "src/Components/Styled/StyleSheets";
import { StyleProp, Button, ViewStyle, TextInput as TInput, Text } from "react-native";
import { 
    View, Platform, DatePickerIOS, 
    DatePickerAndroid, TimePickerAndroid, StyleSheet
} from "react-native";
import MyDate from "src/common/Date";
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
    readonly?: boolean;
}

interface State {
}

export default class DateInput extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
        };
    }

    private iconType = (): "mandatory" | "attention" => {
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
            <RowView style={[Class.DateInput_Container, this.props.style]}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                {this.renderLeftIcon()}
                <ColumnView style={[Class.DateInput_Decorator, {
                    ...( (this.props.readonly && { borderColor: "transparent" } ) || (this.props.underlineColor && {borderColor: this.props.underlineColor}) ) 
                }]}>
                    {this.renderTouchable()}
                    <View style={Layout.Invisible}>
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
                </ColumnView>
            </RowView>
        );
    }

    private renderTouchable = () => {
        if(this.props.readonly !== true) {
            return ( <TouchableView style={{
                    flex: 1,
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
            <RowView style={Class.DateInput_InputContainer}
            >
                {this.renderText()}
                {this.renderIcon()}
            </RowView>
        )
    }

    private renderText = () => {
        if (this.props.value) {
            return (
                <Text
                    style={[Type.HEADER_5, Class.TextInputType, {
                            ...(this.props.textColor && { color: this.props.textColor })
                        }]
                    }
                >
                    {this.renderDate()}
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

    private renderLeftIcon = () => {
        if(this.props.icon) {
            let type = this.iconType();
            return(
                <Icon
                    type={type}
                    {...Custom.AlertIcon}
                    accessibilityLabel={this.props.accessibilityLabel ? type + this.props.accessibilityLabel : type}
                ></Icon>
            )    
        } else {
            return (
                <View
                    style={[Class.StandardIconContainer, Common.TransparentBackground]}
                ></View>
            )
        }
    }

    private renderDate = () => {
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

    private renderIcon = () => {
        return (
            <Icon
                type={this.props.readonly ? "none" : "right"}
                backgroundColor={"transparent"}
            ></Icon>
        );
    }
}