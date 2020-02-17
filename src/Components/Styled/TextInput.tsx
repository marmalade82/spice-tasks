import React from "react";
import { RowView, ColumnView, HeaderText } from "src/Components/Basic/Basic";
import { 
    LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, Styles, 
    TEXT_VERTICAL_MARGIN, RIGHT_SECOND_MARGIN, TEXT_GREY,
    PLACEHOLDER_GREY, TEXT_HORIZONTAL_MARGIN,
    CONTAINER_VERTICAL_MARGIN, ICON_CONTAINER_WIDTH, PRIMARY_COLOR,
} from "src/Components/Styled/Styles";
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
                {this.renderIcon()}
                <ColumnView style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    borderColor: this.props.underlineColor ? this.props.underlineColor : TEXT_GREY,
                    borderBottomWidth: 1,
                    marginLeft: TEXT_HORIZONTAL_MARGIN,
                }}>
                    <Input
                        value={this.props.value}
                        onChangeText={this.props.onChangeText}
                        placeholder={this.props.placeholder}
                        placeholderTextColor={this.props.placeholderColor ? this.props.placeholderColor : PLACEHOLDER_GREY}
                        style={[ Styles.HEADER_5, {
                            width: "100%",
                            padding: 0,
                            marginBottom: 3,
                            color: this.props.textColor ? this.props.textColor : TEXT_GREY,
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
                    backgroundColor={"transparent"}
                    color={PRIMARY_COLOR}
                    accessibilityLabel={this.props.accessibilityLabel ? "mandatory-" + this.props.accessibilityLabel : "mandatory"}
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
}