import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle, TouchableHighlight } from "react-native";
import Style from "src/Style/Style";



interface Props {
    title: string
    checked: boolean
    onCheck: () => void;
    style: any;
    key: string;
}

interface State {

}

export default class MultipleInputChoice extends React.Component<Props, State> {
    localStyle: any
    constructor(props: Props) {
        super(props);

        this.localStyle = {
            text: {

            },
        }
    }

    containerStyle: () => StyleProp<ViewStyle> = () => {
        return {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderColor: this.props.checked ? "green" : "grey",
            borderWidth: 1,
            aspectRatio: 1,
            borderRadius: 50,
        };
    }

    touchableStyle: () => StyleProp<ViewStyle> = () => {
        return {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            aspectRatio: 1,
            borderRadius: 50,
            backgroundColor: this.props.checked ? "lightyellow" : "lightblue",
        };
    }

    onPress = () => {
        this.props.onCheck();
    }

    render = () => {
        return (
            <View 
                style={[this.containerStyle(), Style.greenBg, this.props.style]}
            >
                <TouchableHighlight
                    style={[this.touchableStyle()]}
                    underlayColor={'white'}
                    onPress={ this.onPress }
                >
                    <Text>{this.props.title}</Text>
                </TouchableHighlight>
            </View>

        );
    }

}