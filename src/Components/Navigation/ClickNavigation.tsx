
import React from "react";
import { View, TouchableOpacity, TouchableHighlight, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props<T extends keyof ScreenParams> {
    navigation: Navigation<ScreenParams>;
    parameters: ScreenParams[T];
    destination: T;
    navType: "navigate" | "push";
    style?: StyleProp<ViewStyle>
}

interface State {}

const localStyle = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "pink",
        justifyContent: "center",
        alignItems: "stretch",
    },
});

export default class ClickNavigation<T extends keyof ScreenParams> extends React.Component<Props<T>, State> {
    constructor(props: Props<T>) {
        super(props);
    }


    render = () => {
        return (
                <TouchableOpacity 
                    style={[localStyle.row, this.props.style]}
                    onPress={() => {
                        if(this.props.navType === "push") {
                            this.props.navigation.push(this.props.destination, this.props.parameters);
                        } else {
                            this.props.navigation.navigate(this.props.destination, this.props.parameters);
                        }
                    }}
                >
                    {this.props.children}
                </TouchableOpacity>
        );
    }
}