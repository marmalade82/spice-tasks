import React from "react";

import { 
    NavigationRow, ScreenHeader, DocumentView, 
    NavigationGroup, BackgroundTitle, Summary ,
    IconButton, ModalRow, ModalIconButton, Icon, Modal,
} from "src/Components/Styled/Styled";
import { FullNavigation } from "src/common/Navigator";
import { TaskParentTypes } from "src/Models/Task/Task";


interface Props {
    visible: boolean
    onRequestClose: () => void;
    navigation: FullNavigation;
}

interface State {

}

export class AddModal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }



    render = () => {
        return (
                <Modal
                    visible={this.props.visible}
                    onRequestClose={this.props.onRequestClose}
                >
                        <ModalRow
                            text={"Goal"}
                            accessibilityLabel={"add-goal"}
                            iconType={"goal"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.props.navigation.navigate("AddGoal", {
                                    id: "",
                                    parent_id: ""
                                })
                                this.props.onRequestClose()
                            }}
                        ></ModalRow>
                        <ModalRow
                            text={"Task"}
                            accessibilityLabel={"add-task"}
                            iconType={"task"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.props.navigation.navigate("AddTask", {
                                    id: "",
                                    parent_id: "",
                                    parent_type: TaskParentTypes.NONE,
                                })
                                this.props.onRequestClose()
                            }}
                        ></ModalRow>
                        <ModalRow
                            text={"Reward"}
                            accessibilityLabel={"add-reward"}
                            iconType={"reward"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.props.navigation.navigate("AddReward", {
                                    id: "",
                                    parent_id: "",
                                })
                                this.props.onRequestClose()
                            }}
                        ></ModalRow>
                        <ModalRow
                            accessibilityLabel={"add-penalty"}
                            text={"Penalty"}
                            iconType={"penalty"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.props.navigation.navigate("AddPenalty", {
                                    id: "",
                                    parent_id: "",
                                })
                                this.props.onRequestClose()
                            }}
                        ></ModalRow>
                </Modal>
        )
    }
}
export default AddModal;