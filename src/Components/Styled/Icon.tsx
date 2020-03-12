
import React from "react";
import { View, Text, StyleProp, ViewStyle, ScrollView } from "react-native";
import { Icon  } from "react-native-elements";
import { 
    LEFT_SECOND_MARGIN, ICON_CONTAINER_WIDTH, PRIMARY_COLOR, 
    RIGHT_SECOND_MARGIN, TEXT_HORIZONTAL_MARGIN, SECONDARY_COLOR, 
    PRIMARY_COLOR_LIGHT, CONTAINER_VERTICAL_MARGIN, CONTAINER_ELEVATION, 
    LEFT_FIRST_MARGIN, Styles, TEXT_VERTICAL_MARGIN, ROW_HEIGHT, TEXT_GREY,
} from "src/Components/Styled/Styles";


interface Props {
    type: "complete" | "delete" | "goal" | "task" | 
        "reward" | "penalty" | "mandatory" | "attention" | "info" | "recur"| 
        "earned_reward" | "earned_penalty" | "right" | "left" | "first" | "last" | "none" | 
        "fail" | "add" | "arrow-left" | "save" |
        "home" | "list";
    accessibilityLabel?: string;
    backgroundColor?: string;
    color?: string;
    size?: number;
}

interface State {

}


export default class StyledIcon extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
                <View 
                    style={[{
                        height: ICON_CONTAINER_WIDTH,
                        width: ICON_CONTAINER_WIDTH,
                        borderRadius: ICON_CONTAINER_WIDTH/2,
                        backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : PRIMARY_COLOR,
                    }, Styles.CENTERED]}
                    accessibilityLabel={this.props.accessibilityLabel}
                >
                    {this.renderIcon()}
                </View>
        );
    }

    renderIcon = () => {
        switch(this.props.type) {
            case "complete": {
                return (
                    <Icon
                        name={"check"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : "white"}
                        size={this.props.size ? this.props.size : 20}
                    >
                    </Icon>
                );
            } break;
            case "delete": {
                return (
                    <Icon
                        name={"trash"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : "white"}
                        size={this.props.size ? this.props.size : 20}
                    >
                    </Icon>
                );

            } break;
            case "goal": {
                return (
                    <Icon
                        name='target'
                        type='feather'
                        color={this.props.color ? this.props.color : SECONDARY_COLOR}
                        size={this.props.size ? this.props.size : 20}
                    >

                    </Icon>
                );
            } break;
            case "task": {
                return (
                    <Icon
                        name='activity'
                        type='feather'
                        color={this.props.color ? this.props.color : SECONDARY_COLOR}
                        size={this.props.size ? this.props.size : 20}
                    >

                    </Icon>
                );
            } break;
            case "reward": {
                return (
                    <Icon
                        name='star'
                        type='feather'
                        color={this.props.color ? this.props.color : SECONDARY_COLOR}
                        size={this.props.size ? this.props.size : 20}
                    >

                    </Icon>
                );
            } break;
            case "penalty": {
                return (
                    <Icon
                        name='zap'
                        type='feather'
                        color={this.props.color ? this.props.color : SECONDARY_COLOR}
                        size={this.props.size ? this.props.size : 20}
                    >

                    </Icon>
                );
            } break;
            case "mandatory": {
                return (
                    <Icon
                        name='heart'
                        type='feather'
                        color={this.props.color ? this.props.color : SECONDARY_COLOR}
                        size={this.props.size ? this.props.size : 20}
                    >

                    </Icon>
                );
            } break;
            case "attention": {
                return (
                    <Icon
                        name='alert-triangle'
                        type='feather'
                        color={this.props.color ? this.props.color : SECONDARY_COLOR}
                        size={this.props.size ? this.props.size : 20}
                    >

                    </Icon>
                );
            } break;
            case "info": {
                return (
                    <Icon
                        name='info'
                        type='feather'
                        color={this.props.color ? this.props.color : SECONDARY_COLOR}
                        size={this.props.size ? this.props.size : 20}
                    >

                    </Icon>
                );
            } break;
            case "recur": {
                return (
                    <Icon
                        name="repeat"
                        type="feather"
                        color={this.props.color ? this.props.color : SECONDARY_COLOR}
                        size={this.props.size ? this.props.size : 20}
                    ></Icon>
                );
            } break;
            case "earned_reward": {
                return (
                    <Icon
                        name="award"
                        type="feather"
                        color={this.props.color ? this.props.color : SECONDARY_COLOR}
                        size={this.props.size ? this.props.size : 20}
                    ></Icon>
                );
            } break;
            case "earned_penalty": {
                return (
                    <Icon
                        name="thumbs-up"
                        type="feather"
                        color={this.props.color ? this.props.color : SECONDARY_COLOR}
                        size={this.props.size ? this.props.size : 20}
                    ></Icon>
                );
            } break;
            case "right": {
                return (
                    <Icon
                        name={"chevron-right"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : TEXT_GREY}
                        size={this.props.size ? this.props.size : 20}
                        style={{
                        }}
                    ></Icon>
                );
            } break;
            case "left": {
                return (
                    <Icon
                        name={"chevron-left"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : TEXT_GREY}
                        size={this.props.size ? this.props.size : 20}
                        style={{
                        }}
                    ></Icon>
                );
            } break;
            case "first": {
                return (
                    <Icon
                        name={"chevrons-right"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : TEXT_GREY}
                        size={this.props.size ? this.props.size : 20}
                        style={{
                        }}
                    ></Icon>
                );
            } break;
            case "last": {
                return (
                    <Icon
                        name={"chevrons-left"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : TEXT_GREY}
                        size={this.props.size ? this.props.size : 20}
                        style={{
                        }}
                    ></Icon>
                );
            } break;
            case "fail" : {
                return (
                    <Icon
                        name={"x"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : TEXT_GREY}
                        size={this.props.size ? this.props.size : 20}
                        style={{
                        }}
                    ></Icon>
                )
            } break;
            case "add" :  {
                return (
                    <Icon
                        name={"plus"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : TEXT_GREY}
                        size={this.props.size ? this.props.size : 20}
                        style={{
                        }}
                    ></Icon>
                )
            } break;
            case "arrow-left": {
                return (
                    <Icon
                        name={"arrow-left"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : TEXT_GREY}
                        size={this.props.size ? this.props.size : 20}
                        style={{
                        }}
                    ></Icon>
                )
            } break;
            case "save": {
                return (
                    <Icon
                        name={"save"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : TEXT_GREY}
                        size={this.props.size ? this.props.size : 20}
                        style={{
                        }}
                    ></Icon>
                )
            } break;
            case "home": {
                return (
                    <Icon
                        name={"home"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : TEXT_GREY}
                        size={this.props.size ? this.props.size : 20}
                        style={{
                        }}
                    ></Icon>
                )
            } break;
            case "list": {
                return (
                    <Icon
                        name={"list"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : TEXT_GREY}
                        size={this.props.size ? this.props.size : 20}
                        style={{
                        }}
                    ></Icon>
                )
            } break;
            default: {
                return null
            }
        }
    }
}

export { StyledIcon as Icon };