import React from "react";
import { Layout, Type, Class, Custom } from "src/Components/Styled/StyleSheets";
import { RowView, ColumnView, HeaderText } from "src/Components/Basic/Basic";
import { StyleProp, ViewStyle, TextInput as Input } from "react-native";
import { View } from "react-native";
import { Icon } from "./Icon";

interface Props {
    style?: StyleProp<ViewStyle>;
    placeholder?: string;
    placeholderColor?: string;
    textColor?: string;
    underlineColor? : string;
    value: string;
    onChangeText: (s :string) => void;
    accessibilityLabel?: string;
    multiline?: boolean;
    keyboardType? : "number-pad";
    onEndEditing?: () => void;
    onBlur?: () => void;
    icon?: "mandatory" | "attention";
}

export default class TextInput extends React.Component<Props> {

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
            <RowView style={[Class.TextInput_Container , this.props.style]}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                {this.renderIcon()}
                <ColumnView style={[Class.TextInput_Decorator, {
                    ...(this.props.underlineColor && {borderColor: this.props.underlineColor})
                }]}>
                    <Input
                        value={this.props.value}
                        onChangeText={this.props.onChangeText}
                        placeholder={this.props.placeholder}
                        {...Custom.MultilineInput_TextInput}
                        {...(this.props.placeholderColor && {placeholderTextColor: this.props.placeholderColor}) }
                        style={[ Type.HEADER_5, {
                            ...Class.MultilineInput_Text,
                            ...(this.props.textColor && {color: this.props.textColor})
                        }]}
                        multiline={this.props.multiline ? true : false}
                        numberOfLines={this.props.multiline ? 1 : undefined}
                        accessibilityLabel={this.props.accessibilityLabel ? "input-" + this.props.accessibilityLabel : undefined}
                        keyboardType={this.props.keyboardType}
                        onEndEditing={this.props.onEndEditing}
                        onBlur={this.props.onBlur}
                    ></Input>
                </ColumnView>
            </RowView>
        );
    }

    renderIcon = () => {
        if(this.props.icon) {
            return(
                <Icon
                    type={this.iconType()}
                    {...Custom.AlertIcon}
                    accessibilityLabel={this.props.accessibilityLabel ? "mandatory-" + this.props.accessibilityLabel : "mandatory"}
                ></Icon>
            )    
        } else {
            return (
                <Icon
                    type={"none"}
                    backgroundColor={"transparent"}
                >
                </Icon>
            )
        }

    }
}