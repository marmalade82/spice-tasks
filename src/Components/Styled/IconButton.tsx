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
    type: "add" | "edit" | "more";
    onPress?: () => void;
    accessibilityLabel?: string;
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
            >
                <View 
                    style={[{
                        height: ICON_CONTAINER_WIDTH,
                        width: ICON_CONTAINER_WIDTH,
                        borderRadius: ICON_CONTAINER_WIDTH/2,
                        backgroundColor: PRIMARY_COLOR,
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
                        size={20}
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