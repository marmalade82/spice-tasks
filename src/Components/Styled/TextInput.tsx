import React from "react";
import { RowView, ColumnView, HeaderText } from "src/Components/Basic/Basic";
import { 
    LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, Styles, 
    TEXT_VERTICAL_MARGIN, RIGHT_SECOND_MARGIN, TEXT_GREY,
    PLACEHOLDER_GREY,
    CONTAINER_VERTICAL_MARGIN,
} from "src/Components/Styled/Styles";
import { StyleProp, ViewStyle, TextInput as Input } from "react-native";

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
}

export default class TextInput extends React.Component<Props> {


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
                    ></Input>
                </ColumnView>
            </RowView>
        );
    }
}