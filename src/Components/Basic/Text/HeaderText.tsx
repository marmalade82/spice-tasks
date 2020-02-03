
import React from "react";
import { StyleProp, ViewStyle, StyleSheet, View, TextStyle, Text } from "react-native";


interface Props {
    style: StyleProp<TextStyle>
    level: 1 | 2 | 3 | 4 | 5 | 6
    accessibilityLabel?: string;
    numberOfLines?: number;
    ellipsizeMode?: "clip" | "head" | "middle" | "tail"
}

interface State {

}

const localStyle = StyleSheet.create({
    headerDefault: {
        fontFamily: "OpenSans-Regular",
        color: "black",
        fontSize: 16,
    }
})

export default class HeaderText extends React.Component<Props, State> {

    headerStyle = (): StyleProp<TextStyle> => {
        switch(this.props.level) { 
            case 1: {           // Main section title
                return {
                    fontSize: 22,
                    fontFamily: "OpenSans-SemiBold",
                }
            }
                break;
            case 2: {
                return {
                    fontSize: 20,
                    fontFamily: "OpenSans-SemiBold",
                }
            }
                break;
            case 3: {
                return {
                    fontSize: 17, 
                    fontFamily: "OpenSans-SemiBold",
                }
            }
                break;
            case 4: {
                return {
                    fontSize: 20,
                    fontFamily: "AlegreyaSansSC-Regular",
                }
            }
                break;
            case 5: {
                return {
                    fontSize: 17,
                    fontFamily: "OpenSans-Regular",
                }
            }
                break;
            case 6: {
                this.props.level
            }
                break;
            default: {
                return {

                }
            }
        }
    }

    render = () => {
        return (
            <Text style={[localStyle.headerDefault, this.headerStyle(), this.props.style]}
                accessibilityLabel={this.props.accessibilityLabel} 
                numberOfLines={this.props.numberOfLines}
                ellipsizeMode={this.props.ellipsizeMode ? this.props.ellipsizeMode : "tail"}
            >
                {this.props.children}
            </Text>
        );
    }

}