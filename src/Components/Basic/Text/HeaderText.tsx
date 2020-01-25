
import React from "react";
import { StyleProp, ViewStyle, StyleSheet, View, TextStyle, Text } from "react-native";


interface Props {
    style: StyleProp<TextStyle>
    level: 1 | 2 | 3 | 4 | 5 | 6
    accessibilityLabel?: string;
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

                }
            }
                break;
            case 2: {
                this.props.level
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
                    fontSize: 17,
                    fontFamily: "OpenSans-Italic",
                }
            }
                break;
            case 5: {
                this.props.level
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
            >
                {this.props.children}
            </Text>
        );
    }

}