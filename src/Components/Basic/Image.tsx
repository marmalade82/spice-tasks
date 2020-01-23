import React from "react";
import { Image as ReactImage, StyleSheet, StyleProp, ImageStyle, ImageSourcePropType} from "react-native";

interface Props {
    style?: StyleProp<ImageStyle>;
    accessibilityLabel: string;
    source: ImageSourcePropType;
}

interface State {

}

const localStyle = StyleSheet.create({
    default: {
        resizeMode: "contain",
        flex: 1,
        height: undefined,
        width: undefined,
    }
});

export default class Image extends React.Component<Props, State> {

    render = () => {
        return (
            <ReactImage
                accessibilityLabel={this.props.accessibilityLabel}
                source={this.props.source}
                style={[localStyle.default, this.props.style]}
            >

            </ReactImage>
        );
    }
}