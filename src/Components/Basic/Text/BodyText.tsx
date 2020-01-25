import React from "react";
import { Text, StyleSheet, TextStyle, StyleProp } from "react-native";



interface Props {
    style: StyleProp<TextStyle>
    accessibilityLabel? : string;
}


interface State {

}

const localStyle = StyleSheet.create({
    defaultText: {
        fontFamily: "OpenSans-Regular",
        color: "black",
        fontSize: 17,
    }
});


export default class BodyText extends React.Component<Props, State> {

    render = () => {
        return (
            <Text style={[localStyle.defaultText,]} accessibilityLabel={this.props.accessibilityLabel}>
                {this.props.children}
            </Text>
        );
    }
}