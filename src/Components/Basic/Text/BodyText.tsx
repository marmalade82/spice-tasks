import React from "react";
import { Text, StyleSheet, TextStyle, StyleProp } from "react-native";



interface Props {
    style: StyleProp<TextStyle>
}


interface State {

}

const localStyle = StyleSheet.create({
    defaultText: {
        fontFamily: "OpenSans-Regular",
        color: "black",
        fontSize: 16,
    }
});


export default class BodyText extends React.Component<Props, State> {

    render = () => {
        return (
            <Text style={[localStyle.defaultText,]}>
                {this.props.children}
            </Text>
        );
    }
}