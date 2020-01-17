
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
    navigation: any;
    parameters: object;
    destination: string;
    navType: "navigate" | "push";
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
        flexDirection: "column",
        backgroundColor: "pink",
        justifyContent: "center",
        alignItems: "stretch",
    },
});

export default class ClickNavigation extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }


    render = () => {
        return (
                <TouchableOpacity 
                    style={[localStyle.row]}
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