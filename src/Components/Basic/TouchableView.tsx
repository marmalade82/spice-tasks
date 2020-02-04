import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import React from "react";

interface Props {
    style: StyleProp<ViewStyle>
    onPress: () => void;
}

export default class TouchableView extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <TouchableOpacity
                style={this.props.style}
                onPress={this.props.onPress}
            >
                {this.props.children}
            </TouchableOpacity>
        );
    }
}