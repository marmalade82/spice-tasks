import React from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import Style from "../../styles/Style";


interface Props {
    title: string
    navigation: Navigator
}

interface State {

}

interface Navigator {
    navigate: () => void
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "stretch",
        borderColor: "grey",
        borderWidth: 1,
    },
    text: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        flex: 2,
        justifyContent: "center",
        alignItems: "stretch",
    },
});

/* This class opens whatever inputs are given to it in a modal. When the modal is saved,
   The input state at that time is returned to the parent.

*/
export default class ModalInputFullScreen extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <View style={[localStyle.container, Style.maxInputHeight]}>
                <View style={[Style.yellowBg, localStyle.text]}>
                    <Text>{this.props.title}</Text>
                </View>
                <View style={[Style.whiteBg, localStyle.button]}>
                    <Button
                        title={"Edit"}
                        onPress={() => {this.props.navigation.navigate()}} 
                    >
                    </Button>
                </View>
            </View>
        );
    }
}