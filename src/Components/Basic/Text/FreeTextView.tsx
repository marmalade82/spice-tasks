import React from "react";
import { StyleProp, ViewStyle, StyleSheet, View, } from "react-native";


interface Props {
    style: StyleProp<ViewStyle>
}

interface State {

}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "stretch",
        marginLeft: 40, // Going for a 3/4 ratio for top/side margins on the text.
        marginRight: 40,
        marginTop: 30,
        //backgroundColor: "lightblue",
    }
})

/**
 * This class correctly implements basic left, right, and upper margins for a container of text. These can be overridden if necessary.
 * Text is treated as flowing from top to bottom, and from left to right, as a sort of document
 */
export default class FreeTextView extends React.Component<Props, State> {


    render = () => {
        return (
            <View style={[localStyle.container, this.props.style]}>
                {this.props.children}
            </View>
        )
    }
}