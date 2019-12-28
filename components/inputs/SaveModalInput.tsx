import React from "react";
import ModalInput from "./ModalInput";
import { View, StyleSheet, Button, Text } from "react-native";
import Style from "../../styles/Style";


interface Props {
    title: string
    animationType: "none" | "slide" | "fade"
    screenType: "grey" | "transparent" | "full"
    value: string
    onSave: () => void // detects whether the user clicked the "save" button
}

interface State {
}

const localStyle = StyleSheet.create({
    modalContainer: {
        justifyContent: "flex-start",
        alignItems: "stretch",
    },
    saveContainer: {
        flex: 1,
    },
    children: {
        flex: 1,
    },

});


export default class SaveModalInput extends React.Component<Props,State> {
    constructor(props: Props) {
        super(props);
    }

    onPress = () => {
        this.props.onSave();
    }

    render = () => {
        return (
            <ModalInput
                title={this.props.title}
                animationType={this.props.animationType}
                screenType={this.props.screenType}
                value={this.props.value}
            >
                <View style={[Style.modalContainer, Style.whiteBg, localStyle.modalContainer]}>
                    <View style={[Style.maxInputHeight, Style.yellowBg, localStyle.saveContainer]}>
                        <Button 
                            title="Save"
                            onPress={this.onPress}
                        >
                        </Button>
                    </View>
                    <View style={[localStyle.children]}>
                        { this.props.children }
                    </View>
                </View>
            </ModalInput>
        );
    }
}