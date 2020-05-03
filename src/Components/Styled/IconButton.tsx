import React from "react";
import { View, Text, StyleProp, ViewStyle, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import { Icon as I } from "src/Components/Styled/Icon";
import { TouchableView } from "../Basic/Basic";
import { StyleSheetContext } from "./StyleSheets";

interface Props {
    type: "add" | "edit" | "more" | "settings" | "enable" | "disable" | "complete" | "delete" | "save" | 
            "sort";
    onPress?: () => void;
    accessibilityLabel?: string;
    backgroundColor?: string;
    overlaySize?: number;
    size?: number;
    color?: string;
}

interface State {

}


export default class IconButton extends React.Component<Props, State> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <TouchableView
                style={{
                    flex:0
                }}
                onPress={this.props.onPress ? this.props.onPress : () => {}}
                accessibilityLabel={
                    this.props.accessibilityLabel 
                }
            >
                {this.renderI()}
            </TouchableView>
        );
    }

    private renderI = () => {
        const { Class, Common, Custom } = this.context;
        let type = this.props.type;
        const props = {
            ...Custom.IconButton_Icon,
            ...(this.props.color && {color: this.props.color}),
            ...(this.props.size && {size: this.props.size }),
            ...(this.props.backgroundColor && {backgroundColor: this.props.backgroundColor})
        }

        return (
            <I
                type={type}
                {...props}
                accessibilityLabel={this.props.accessibilityLabel}
                backgroundHeight={this.props.overlaySize}
            ></I>
        );
    }
}