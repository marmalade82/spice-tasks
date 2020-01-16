import React from "react";
import { Button as ReactButton } from "react-native";

interface Props {
    title: string;
    accessibilityLabel: string;
    onPress : () => void;
    color: string;
}

interface State {

}

export default class Button extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }


    render = () => {
        return (
            <ReactButton
                title={this.props.title}
                accessibilityLabel={"input-" + this.props.accessibilityLabel}
                onPress={this.props.onPress}
                color={this.props.color}
            ></ReactButton>
        )
    }
}