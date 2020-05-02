import React from "react";
import { Layout, Type, Class } from "src/Components/Styled/StyleSheets";
import IconButton from "src/Components/Styled/IconButton";
import { ScrollView, View, Modal as ReactModal, TouchableWithoutFeedback } from "react-native";

interface Props {
    visible: boolean;
    onRequestClose: () => void;
    height? : number;
    accessibilityLabel? : string;
}

interface State {

}

export default class Modal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {

        };
    }

    render = () => {
        return (
            <ReactModal
                visible={this.props.visible}
                transparent={true}
                onRequestClose={ this.props.onRequestClose }
                animationType={ "fade" }
            >
                <TouchableWithoutFeedback
                    style={{
                        flex: 1
                    }}
                    onPress={(event) => {
                        event.preventDefault();
                        this.props.onRequestClose();
                    }}
                >
                    <View style={[Class.Modal_Overlay, Layout.CENTERED]}
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
                                    ...Class.Modal_Content,
                                    height: this.props.height,
                                }}
                                accessibilityLabel={this.props.accessibilityLabel ? "modal-" + this.props.accessibilityLabel : undefined}
                            >
                                <ScrollView>
                                    {this.props.children}
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </ReactModal>
        );
    }
}