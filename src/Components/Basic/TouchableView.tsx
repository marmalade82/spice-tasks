import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import React from "react";

interface Props {
    style: StyleProp<ViewStyle>
    onPress: () => void;
    accessibilityLabel?: string;
}

export default class TouchableView extends React.Component<Props> {
    touchRef: React.RefObject<TouchableOpacity>
    constructor(props: Props) {
        super(props);
        this.touchRef = React.createRef();
    }

    render = () => {
        return (
            <TouchableOpacity
                style={this.props.style}
                onPress={this.props.onPress}
                accessibilityLabel={
                    this.props.accessibilityLabel ? "input-" + this.props.accessibilityLabel : undefined
                }
                ref={this.touchRef}
            >
                {this.props.children}
            </TouchableOpacity>
        );
    }

    touch = () => {
        if(this.touchRef.current) {
            this.touchRef.current.touchableHandlePress(null as any);
            this.touchRef.current.setNativeProps({
                opacity: 0.2
            })
            setTimeout(() => {
                if(this.touchRef.current) {
                    this.touchRef.current.setOpacityTo(1);
                }
            }, 300 )
            console.log("HANDLING TOUCH");
        }
    }
}