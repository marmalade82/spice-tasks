
import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

interface Props {
    style: StyleProp<ViewStyle>
}

interface State {

}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row-reverse',
        backgroundColor: '#FFF',
        alignItems: 'stretch',
        justifyContent: 'center',
    }
});

export default class RowReverseView extends React.Component<Props, State> {

    style = () => {
        let styles = [localStyle.container, this.props.style];
        return styles;
    }

    render = () => {
        return (
            <View style={this.style()}>
                {this.props.children}
            </View>
        );
    }
}