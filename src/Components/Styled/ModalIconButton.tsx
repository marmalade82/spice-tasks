import React from "react";
import IconButton from "src/Components/Styled/IconButton";
import { View, TouchableWithoutFeedback } from "react-native";
import { LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, RIGHT_SECOND_MARGIN, OVERLAY, Styles, MODAL_VERTICAL_PADDING } from "./Styles";
import Modal from "src/Components/Styled/Modal";
import DataComponent from "src/Components/base/DataComponent";

interface Props {
    type: "add" | "edit" | "more"
    size?: number;
    color?: string;
    overlaySize?: number
    accessibilityLabel?: string;
    data: State | false;
    onDataChange: (d: State) => void;
    backgroundColor?: string;
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
                    color={this.props.color}
                    size={this.props.size}
                    overlaySize={this.props.overlaySize}
                    accessibilityLabel={this.props.accessibilityLabel}
                    backgroundColor={this.props.backgroundColor}
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
                    onRequestClose={ () => { this.hideModal() } }
                >
                    {this.props.children}
                </Modal>
        )
    }
}