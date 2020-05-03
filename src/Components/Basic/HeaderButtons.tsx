import React from "react";
import TouchableView from "./TouchableView";
import { Icon } from "src/Components/Styled/Icon";
import { EventDispatcher } from "src/common/EventDispatcher";

interface Props {
    dispatcher: EventDispatcher;
    eventName: string;
}

export class HeaderAddButton extends React.Component<Props> {

    render = () => {
        const { dispatcher, eventName } = this.props;
        return (
            <TouchableView
                style={{}}
                onPress={() => {
                    dispatcher.fireEvent(eventName);
                }}
                accessibilityLabel={"add-button"}
            >
                <Icon type={"add"} color="white" backgroundColor="transparent"
                    size={23}
                ></Icon> 
            </TouchableView>
        )
    }
}

export class HeaderSaveButton extends React.Component<Props> {

    render = () => {
        const { dispatcher, eventName } = this.props;
        return (
            <TouchableView
                style={{}}
                onPress={() => {
                    dispatcher.fireEvent(eventName);
                }}
                accessibilityLabel={"save-button"}
            >
                <Icon type={"save"} color="white" backgroundColor="transparent"
                    size={23}
                ></Icon> 
            </TouchableView>
        )
    }
}

export class HeaderSettingsButton extends React.Component<Props> {

    render = () => {
        const { dispatcher, eventName } = this.props;
        return (
            <TouchableView
                style={{}}
                onPress={() => {
                    dispatcher.fireEvent(eventName);
                }}
                accessibilityLabel={"settings-button"}
            >
                <Icon type={"settings"} color="white" backgroundColor="transparent"
                    size={20}
                ></Icon> 
            </TouchableView>
        )
    }
}