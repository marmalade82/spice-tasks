
import React from "react";
import { View, Text, StyleProp, ViewStyle, ScrollView } from "react-native";
import { Icon  } from "react-native-elements";
import { 
    LEFT_SECOND_MARGIN, ICON_CONTAINER_WIDTH, PRIMARY_COLOR, 
    RIGHT_SECOND_MARGIN, TEXT_HORIZONTAL_MARGIN, SECONDARY_COLOR, 
    PRIMARY_COLOR_LIGHT, CONTAINER_VERTICAL_MARGIN, CONTAINER_ELEVATION, 
    LEFT_FIRST_MARGIN, Styles, TEXT_VERTICAL_MARGIN, ROW_HEIGHT
} from "src/Components/Styled/Styles";


interface Props {
    type: "complete" | "delete";
    accessibilityLabel?: string;
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
                        backgroundColor: PRIMARY_COLOR,
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
                        color={"white"}
                        size={20}
                    >
                    </Icon>
                );
            } break;
            case "delete": {
                return (
                    <Icon
                        name={"trash"}
                        type={"feather"}
                        color={"white"}
                        size={20}
                    >
                    </Icon>
                );

            }
            default: {
                return undefined
            }
        }
    }
}

export { StyledIcon as Icon };