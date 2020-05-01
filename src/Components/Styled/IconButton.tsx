import React from "react";
import { View, Text, StyleProp, ViewStyle, ScrollView } from "react-native";
import { Icon } from "react-native-elements";
import { Icon as I } from "src/Components/Styled/Icon";

import { 
    LEFT_SECOND_MARGIN, ICON_CONTAINER_WIDTH, PRIMARY_COLOR, 
} from "src/Components/Styled/Styles";
import { TouchableView } from "../Basic/Basic";

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
        let type = this.props.type;

        return (
            <I
                type={type}
                color={this.props.color ? this.props.color : PRIMARY_COLOR}
                size={this.props.size ? this.props.size : 29}
                backgroundColor={this.props.backgroundColor ? this.props.backgroundColor : "white"}
                accessibilityLabel={this.props.accessibilityLabel}
                backgroundHeight={this.props.overlaySize}
            ></I>
        );
    }
}