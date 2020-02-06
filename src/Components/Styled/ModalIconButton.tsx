import React from "react";
import IconButton from "src/Components/Styled/IconButton";
import { View, Modal, TouchableWithoutFeedback } from "react-native";
import { LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, RIGHT_SECOND_MARGIN } from "./Styles";
import DataComponent from "src/Components/base/DataComponent";

interface Props {
    type: "add" | "edit" | "more"
    accessibilityLabel?: string;
    data: State | false;
    onDataChange: (d: State) => void;
}

interface State {
    showModal: boolean;
}

export default class ModalIconButton extends DataComponent<Props, State, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showModal: false,
        }
    }

    hideModal = () => {
        this.setData({
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
                        this.setData({
                            showModal: true,
                        })
                    }}
                    accessibilityLabel={this.props.accessibilityLabel}
                >
                </IconButton>
                {this.renderModal()}
            </View>
        )
    }

    renderModal = () => {
        return (
                <Modal
                    visible={this.data().showModal}
                    transparent={true}
                    onRequestClose={ () => { this.hideModal() } }
                    animationType={ "fade" }
                >
                    <TouchableWithoutFeedback
                        style={{
                            flex: 1
                        }}
                        onPress={(event) => {
                            this.hideModal();
                            event.preventDefault();
                        }}
                    >
                        <View style={{
                                flex: 1,
                                backgroundColor: "rgba(15,15,15,0.6)",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingLeft: RIGHT_SECOND_MARGIN,
                                paddingRight: RIGHT_SECOND_MARGIN,
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
                                    justifyContent: "flex-start",
                                    alignItems: "stretch",
                                    backgroundColor: "white",
                                    width: "100%",
                                    paddingTop: 10,
                                    paddingBottom: 10,
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