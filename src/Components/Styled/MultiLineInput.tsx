
import { Layout, Type, StyleSheetContext } from "src/Components/Styled/StyleSheets";
import React from "react";
import { RowView, ColumnView, HeaderText } from "src/Components/Basic/Basic";
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
}

export default class MultiLineInput extends React.Component<Props> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>


    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <RowView style={[Class.MultilineInput_Container,  this.props.style]}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                <ColumnView style={[Class.MultilineInput_Decorator, {
                    ...(this.props.underlineColor && { borderColor: this.props.underlineColor } )
                }]}>
                    <Input
                        multiline={true}
                        numberOfLines={1}
                        value={this.props.value}
                        onChangeText={this.props.onChangeText}
                        placeholder={this.props.placeholder}
                        style={[ Type.HEADER_5, Class.MultilineInput_Text, {
                            ...(this.props.textColor && { color: this.props.textColor})
                        }]}
                        accessibilityLabel={this.props.accessibilityLabel ? "input-" + this.props.accessibilityLabel : undefined}

                        {...Custom.MultilineInput_TextInput}
                        {...(this.props.placeholderColor && { placeholderTextColor: this.props.placeholderColor })}
                    ></Input>
                </ColumnView>
            </RowView>
        );
    }
}