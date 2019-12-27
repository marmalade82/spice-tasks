import React from "react";
import { Button, Text, View, StyleSheet, Modal } from "react-native";
import Style from "../../styles/Style";


interface Props {
    title: string
    animationType: "none" | "fade" | "slide"
    screenType: "full" | "transparent" | "grey" 
    onOpen?: () => void
    onClose?: () => void
}

interface State {
    showModal: boolean
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
    modalBgFull: {
        flex: 1,
        backgroundColor: "white",
    },
    modalBgGrey: {
        flex: 1,
        backgroundColor: "rgba(128,128,128,0.6)",
    },
    modalBgTransparent: {
        flex: 1,
    }
});

/* This class opens whatever inputs are given to it in a modal. When the modal is saved,
   The input state at that time is returned to the parent.

*/
export default class ModalInput extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            showModal: false
        }
    }

    showModal = () => {
        if(this.props.onOpen) {
            this.props.onOpen();
        }
        this.setState({
            showModal: true
        })
    }

    hideModal = () => {
        if(this.props.onClose) {
            this.props.onClose();
        }
        this.setState({
            showModal: false
        })
    }

    renderFullScreen = () => {
        return (
            <View style={[localStyle.container, Style.maxInputHeight]}>
                <View style={[Style.yellowBg, localStyle.text]}>
                    <Text>{this.props.title}</Text>
                </View>
                <View style={[Style.whiteBg, localStyle.button]}>
                    <Button
                        title={"Edit"}
                        onPress={() => { this.showModal() }}
                    >
                    </Button>
                </View>
                <Modal
                    visible={this.state.showModal}
                    transparent={false}
                    onRequestClose={ () => { this.hideModal() } }
                    animationType={ this.props.animationType }
                >
                    <View style={[localStyle.modalBgFull]}>
                        {this.props.children}
                    </View>
                </Modal>
            </View>
        );
    }

    renderGrey = () => {
        return (
            <View style={[localStyle.container, Style.maxInputHeight]}>
                <View style={[Style.yellowBg, localStyle.text]}>
                    <Text>{this.props.title}</Text>
                </View>
                <View style={[Style.whiteBg, localStyle.button]}>
                    <Button
                        title={"Edit"}
                        onPress={() => { this.showModal() }}
                    >
                    </Button>
                </View>
                <Modal
                    visible={this.state.showModal}
                    transparent={true}
                    onRequestClose={ () => { this.hideModal() } }
                    animationType={ this.props.animationType }
                >
                    <View style={[localStyle.modalBgGrey]}>
                        {this.props.children}
                    </View>
                </Modal>
            </View>
        );
    }

    renderTransparent = () => {
        return (
            <View style={[localStyle.container, Style.maxInputHeight]}>
                <View style={[Style.yellowBg, localStyle.text]}>
                    <Text>{this.props.title}</Text>
                </View>
                <View style={[Style.whiteBg, localStyle.button]}>
                    <Button
                        title={"Edit"}
                        onPress={() => { this.showModal() }}
                    >
                    </Button>
                </View>
                <Modal
                    visible={this.state.showModal}
                    transparent={true}
                    onRequestClose={ () => { this.hideModal() } }
                    animationType={ this.props.animationType }
                >
                    <View style={[localStyle.modalBgTransparent]}>
                            {this.props.children}
                    </View>
                </Modal>
            </View>

        );
    }

    modalStyle = () => {
        if(this.props.screenType === "full") {
            return localStyle.modalBgFull;
        }

        if(this.props.screenType === "transparent") {
            return localStyle.modalBgTransparent;
        }

        if(this.props.screenType === "grey") {
            return localStyle.modalBgGrey;
        }
    }

    renderModal = () => {
        return (
                <Modal
                    visible={this.state.showModal}
                    transparent={true}
                    onRequestClose={ () => { this.hideModal() } }
                    animationType={ this.props.animationType }
                >
                    <View style={[ this.modalStyle() ]}>
                            {this.props.children}
                    </View>
                </Modal>
        )
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
                        onPress={() => { this.showModal() }}
                    >
                    </Button>
                </View>
                {this.renderModal()}
            </View>
        );
    }
}