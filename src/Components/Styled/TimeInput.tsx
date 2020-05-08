import React from "react";
import { Layout, Type, StyleSheetContext} from "src/Components/Styled/StyleSheets";
import { RowView, ColumnView, HeaderText, TouchableView } from "src/Components/Basic/Basic";
import { StyleProp, Button, ViewStyle, TextInput as TInput, Text } from "react-native";
import { 
    View, Platform, DatePickerIOS, 
    TimePickerAndroid, StyleSheet
} from "react-native";
import MyDate from "src/common/Date";
import { Icon } from "./Icon";
import moment from "moment";


interface Props {
    style?: StyleProp<ViewStyle>;
    placeholder?: string;
    placeholderColor?: string;
    textColor?: string;
    underlineColor? : string;
    value: Date;
    onChangeTime: (s : Date) => void;
    accessibilityLabel?: string;
    format: "12:00 AM" | "00:00"
    onBlur?: () => void;
    icon?: "mandatory" | "attention";
    readonly?: boolean;
}

interface State {
}

export default class TimeInput extends React.Component<Props, State> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
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
            await this.onPressTimeAndroid();
        }
    }

    private onPressTimeAndroid = async() => {
        const m = isNaN(this.props.value.valueOf()) ? moment() : moment(this.props.value);
        const dateOpts = await TimePickerAndroid.open({
            hour: m.hour(),
            minute: m.minute(),
            mode: 'default',
        });

        if(dateOpts.action === TimePickerAndroid.timeSetAction) {
            let date = moment(MyDate.Zero().toDate()).hour(dateOpts.hour).minute(dateOpts.minute).toDate();

            this.props.onChangeTime( date );
        }
    }

    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <RowView style={[Class.TimeInput_Container, this.props.style]}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                {this.renderLeftIcon()}
                <ColumnView style={[Class.TimeInput_Decorator, {
                    ...( (this.props.readonly && { borderColor: "transparent"}) || (this.props.underlineColor && { borderColor: this.props.underlineColor}) )
                }]}>
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
                                    this.props.onChangeTime(new MyDate(date).prevMidnight().toDate());
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
        )
    }

    private renderText = () => {
        const { Class, Common, Custom } = this.context;
        if (this.props.value) {
            return (
                <Text
                    style={[Type.HEADER_5, Class.TextInputType, {
                            ...(this.props.textColor && { color: this.props.textColor })
                        }]
                    }
                >
                    {this.renderTime()}
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
        const { Class, Common, Custom } = this.context;
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
                <Icon
                    type={"none"}
                    backgroundColor={"transparent"}
                ></Icon>
            )
        }
    }

    private renderTime = () => {
        if(!moment(this.props.value).isValid()) {
            return "";
        }
        const date = new MyDate(this.props.value)
        switch(this.props.format) {
            case "12:00 AM": {
                return date.format("h:mm A")
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