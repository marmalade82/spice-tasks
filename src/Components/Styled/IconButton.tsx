import React from "react";
import { View, Text, StyleProp, ViewStyle, ScrollView } from "react-native";
import { Icon } from "react-native-elements";

import { 
    LEFT_SECOND_MARGIN, ICON_CONTAINER_WIDTH, PRIMARY_COLOR, 
    RIGHT_SECOND_MARGIN, TEXT_HORIZONTAL_MARGIN, SECONDARY_COLOR, 
    PRIMARY_COLOR_LIGHT, CONTAINER_VERTICAL_MARGIN, CONTAINER_ELEVATION, 
    LEFT_FIRST_MARGIN, Styles, TEXT_VERTICAL_MARGIN, ROW_HEIGHT
} from "src/Components/Styled/Styles";
import { TouchableView } from "../Basic/Basic";

interface Props {
    type: "add" | "edit" | "more" | "settings" | "enable" | "disable" | "complete" | "delete" | "save";
    onPress?: () => void;
    accessibilityLabel?: string;
    backgroundColor?: string;
    overlaySize?: number;
    size?: number;
}

interface State {

}


export default class IconButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        const height = this.props.overlaySize ? this.props.overlaySize : ICON_CONTAINER_WIDTH;
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
                <View 
                    style={[{
                        height: height,
                        width: height,
                        borderRadius: height/2,
                        backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : PRIMARY_COLOR,
                        marginLeft: RIGHT_SECOND_MARGIN/2,
                    }, Styles.CENTERED]}
                    accessibilityLabel={this.props.accessibilityLabel}
                >
                    {this.renderIcon()}
                </View>
            </TouchableView>
        )
    }

    renderIcon = () => {
        switch(this.props.type) {
            case "add": {
                return  (
                    <Icon
                        name={"plus"}
                        type={"feather"}
                        color={"white"}
                        size={this.props.size ? this.props.size : 20}
                    >
                    </Icon>
                );
            } break;
            case "edit": {
                return (
                    <Icon
                        name={"edit"}
                        type={"feather"}
                        color={"white"}
                        size={this.props.size ? this.props.size : 20}
                    >
                    </Icon>
                );
            } break;
            case "more": {
                return (
                    <Icon
                        name={"more-horizontal"}
                        type={"feather"}
                        color={"white"}
                        size={this.props.size ? this.props.size : 20}
                    >
                    </Icon>
                );
            } break;
            case "settings": {
                return (
                    <Icon
                        name={"settings"}
                        type={"feather"}
                        color={"white"}
                        size={this.props.size ? this.props.size : 20}
                    >
                    </Icon>
                );
            } break;
            case "enable": {
                return (
                    <Icon
                        name={"play"}
                        type={"feather"}
                        color={"white"}
                        size={this.props.size ? this.props.size : 20}
                    >
                    </Icon>
                );
            } break;
            case "disable": {
                return (
                    <Icon
                        name={"pause"}
                        type={"feather"}
                        color={"white"}
                        size={this.props.size ? this.props.size : 20}
                    >
                    </Icon>
                );
            } break;
            case "complete": {
            } break;
            case "delete": {
                return (
                    <Icon
                        name={"trash"}
                        type={"feather"}
                        color={"white"}
                        size={this.props.size ? this.props.size : 20}
                    >
                    </Icon>
                );
            } break;
            case "save": {
                return (
                    <Icon
                        name={"save"}
                        type={"feather"}
                        color={"white"}
                        size={this.props.size ? this.props.size : 20}
                    >
                    </Icon>
                );
            } break;
            default: {
                return undefined
            }
        }
    }
}