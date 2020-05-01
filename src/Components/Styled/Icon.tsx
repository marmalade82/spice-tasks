
import React from "react";
import { View, Text, StyleProp, ViewStyle, ScrollView } from "react-native";
import { Icon  } from "react-native-elements";
import { Layout, Type, Class, Custom } from "src/Components/Styled/StyleSheets";


interface Props {
    type: "complete" | "not-complete" | "in-progress" | "delete" | "goal" | "task" | 
        "reward" | "penalty" | "mandatory" | "attention" | "info" | "recur"| 
        "earned_reward" | "earned_penalty" | "right" | "left" | "first" | "last" | "none" | 
        "fail" | "add" | "arrow-left" | "save" |
        "home" | "list" | "habit" | "sort" | "edit" | "more" | "settings" | "enable" | "disable" |
        "ascending" | "descending" | "reports";
    accessibilityLabel?: string;
    backgroundColor?: string;
    color?: string;
    size?: number;
    backgroundHeight ? : number;
    style?: StyleProp<ViewStyle>;
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
                    style={[Class.StandardIconContainer, {
                        ...(this.props.backgroundColor && { backgroundColor: this.props.backgroundColor })
                    }, Layout.CENTERED, this.props.style]}
                    accessibilityLabel={this.props.accessibilityLabel}
                >
                    {this.renderIcon()}
                </View>
        );
    }

    renderIcon = () => {
        const transparent = {
            ...Custom.Icon_Transparent,
            ...(this.props.color && { color: this.props.color}),
            ...(this.props.size && { size: this.props.size}),
        }

        const secondary = {
            ...Custom.Icon_Secondary,
            ...(this.props.color && { color: this.props.color}),
            ...(this.props.size && { size: this.props.size}),
        }

        const grey = {
            ...Custom.Icon_Grey,
            ...(this.props.color && { color: this.props.color}),
            ...(this.props.size && { size: this.props.size}),
        } 

        const primary = {
            ...Custom.Icon_Primary,
            ...(this.props.color && { color: this.props.color}),
            ...(this.props.size && { size: this.props.size}),
        }
        switch(this.props.type) {
            case "ascending": {
                return (
                    <Icon
                        name={"chevron-up"}
                        type={"feather"}
                        {...transparent}
                    ></Icon>
                )
            } break;
            case "descending": {
                return (
                    <Icon
                        name={"chevron-down"}
                        type={"feather"}
                        {...transparent}
                    ></Icon>
                )
            } break;
            case "complete": {
                return (
                    <Icon
                        name={"check"}
                        type={"feather"}
                        {...transparent}
                    >
                    </Icon>
                );
            } break;
            case "not-complete": {
                return (
                    <Icon
                        name={"x"}
                        type={"feather"}
                        {...transparent}
                    >
                    </Icon>
                );
            } break;
            case "in-progress": {
                return (
                    <Icon
                        name={"sun"}
                        type={"feather"}
                        {...transparent}
                    >
                    </Icon>
                );
            } break;
            case "delete": {
                return (
                    <Icon
                        name={"trash"}
                        type={"feather"}
                        {...transparent}
                    >
                    </Icon>
                );

            } break;
            case "goal": {
                return (
                    <Icon
                        name='target'
                        type='feather'
                        {...secondary}
                    >

                    </Icon>
                );
            } break;
            case "task": {
                return (
                    <Icon
                        name='activity'
                        type='feather'
                        {...secondary}
                    >

                    </Icon>
                );
            } break;
            case "reward": {
                return (
                    <Icon
                        name='star'
                        type='feather'
                        {...secondary}
                    >

                    </Icon>
                );
            } break;
            case "penalty": {
                return (
                    <Icon
                        name='zap'
                        type='feather'
                        {...secondary}
                    >

                    </Icon>
                );
            } break;
            case "mandatory": {
                return (
                    <Icon
                        name='heart'
                        type='feather'
                        {...secondary}
                    >

                    </Icon>
                );
            } break;
            case "attention": {
                return (
                    <Icon
                        name='alert-triangle'
                        type='feather'
                        {...secondary}
                    >

                    </Icon>
                );
            } break;
            case "info": {
                return (
                    <Icon
                        name='info'
                        type='feather'
                        {...secondary}
                    >

                    </Icon>
                );
            } break;
            case "recur": {
                return (
                    <Icon
                        name="repeat"
                        type="feather"
                        {...secondary}
                    ></Icon>
                );
            } break;
            case "earned_reward": {
                return (
                    <Icon
                        name="award"
                        type="feather"
                        {...secondary}
                    ></Icon>
                );
            } break;
            case "earned_penalty": {
                return (
                    <Icon
                        name="thumbs-up"
                        type="feather"
                        {...secondary}
                    ></Icon>
                );
            } break;
            case "right": {
                return (
                    <Icon
                        name={"chevron-right"}
                        type={"feather"}
                        {...grey}
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
                        {...grey}
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
                        {...grey}
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
                        {...grey}
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
                        {...grey}
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
                        {...grey}
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
                        {...grey}
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
                        {...grey}
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
                        {...grey}
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
                        {...grey}
                        style={{
                        }}
                    ></Icon>
                )
            } break;
            case "reports": {
                return (
                    <Icon
                        name={"bar-chart"}
                        type={"feather"}
                        {...grey}
                        style={{
                        }}
                    ></Icon>
                )
            } break;
            case "habit": {
                return (
                    <Icon
                        name='book'
                        type='feather'
                        {...secondary}
                    >

                    </Icon>
                );
            } break;
            case "sort": {
                return (
                    <Icon
                        name='sliders'
                        type='feather'
                        {...secondary}
                    >

                    </Icon>
                );
            } break;
            case "edit": {
                return (
                    <Icon
                        name={"edit"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : "white"}
                        size={this.props.size ? this.props.size : 20}
                    >
                    </Icon>
                );
            } break;
            case "more": {
                return (
                    <Icon
                        name={"more-vertical"}
                        type={"feather"}
                        {...primary}
                    >
                    </Icon>
                );
            } break;
            case "settings": {
                return (
                    <Icon
                        name={"settings"}
                        type={"feather"}
                        color={this.props.color ? this.props.color : "white"}
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
                        color={this.props.color ? this.props.color : "white"}
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
                        color={this.props.color ? this.props.color : "white"}
                        size={this.props.size ? this.props.size : 20}
                    >
                    </Icon>
                );
            } break;
            default: {
                return null
            }
        }
    }
}

export { StyledIcon as Icon };