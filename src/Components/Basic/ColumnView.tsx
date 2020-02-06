
import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

interface Props {
    style: StyleProp<ViewStyle>
    accessibilityLabel?: string;
}

interface State {

}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFF',
        alignItems: 'stretch',
        justifyContent: 'center',
    }
});

export default class ColumnView extends React.Component<Props, State> {


    render = () => {
        return (
            <View 
                style={[localStyle.container, this.props.style]}
                accessibilityLabel={this.props.accessibilityLabel} 
            >
                {this.props.children}
            </View>
        );
    }
}