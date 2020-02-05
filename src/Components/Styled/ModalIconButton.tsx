import React from "react";
import IconButton from "src/Components/Styled/IconButton";
import { View, Modal, TouchableWithoutFeedback } from "react-native";

interface Props {
    type: "add" | "edit" | "more"
}

interface State {
    showModal: boolean;
}

export default class ModalIconButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showModal: false,
        }
    }

    hideModal = () => {
        this.setState({
            showModal: false
        })
    }

    render = () => {
        return (
            <View
                style={{
                    flex: 0
                }} 
            >
                <IconButton
                    type={this.props.type}
                    onPress={() => {
                        this.setState({
                            showModal: true,
                        })
                    }}
                >
                </IconButton>
                {this.renderModal()}
            </View>
        )
    }

    renderModal = () => {
        return (
                <Modal
                    visible={this.state.showModal}
                    transparent={true}
                    onRequestClose={ () => { this.hideModal() } }
                    animationType={ "fade" }
                >
                    <TouchableWithoutFeedback
                        style={{
                            flex: 1
                        }}
                        onPress={this.hideModal}
                    >
                        <View style={{
                                flex: 1,
                                backgroundColor: "rgba(128,128,128,0.6)",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableWithoutFeedback
                                style={{
                                    flex:0
                                }}
                                onPress={(event) => {
                                    event.preventDefault()
                                }}
                                touchSoundDisabled={true}
                            >
                                <View style={{
                                    flex: 0,
                                    height: 60,
                                    width: 60,
                                    justifyContent: "flex-start",
                                    alignItems: "stretch",
                                    backgroundColor: "white",
                                }}>
                                    {this.props.children}
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        </TouchableWithoutFeedback>
                </Modal>
        )
    }
}