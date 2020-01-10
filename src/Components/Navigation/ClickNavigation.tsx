
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
    navigation: any;
    parameters: object;
    destination: string;
}

interface State {}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "lightblue",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "95%",
    },
    row: {
        flex: 1,
        backgroundColor: "pink",
        width: "100%",
    },
});

export default class ClickNavigation extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }


    render = () => {
        return (
            <View style={[localStyle.row]}>
                <TouchableOpacity 
                    style={[localStyle.row]}
                    onPress={() => {
                        this.props.navigation.navigate(this.props.destination, this.props.parameters);
                    }}
                >
                    {this.props.children}
                </TouchableOpacity>
            </View>
        );
    }
}