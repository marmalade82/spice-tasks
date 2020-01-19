import React from "react";
import { Button } from "react-native";

type Empty = {

}

interface Props { 
    navigation: any;
    title: string;
    color?: string;
    parameters: Empty;
    destination: string;
    accessibilityLabel: string;
}

interface Navigator {
    navigate: (dest: string, params: Empty) => void;
}

interface State { }

export default class NavigationButton extends React.Component<Props, State> {


    onPress = () => {
        this.props.navigation.navigate(this.props.destination, this.props.parameters);
    }

    render = () => {
        return (
            <Button
                title={this.props.title}
                color={this.props.color}
                onPress={this.onPress}
                accessibilityLabel={"input-" + this.props.accessibilityLabel}
            ></Button>   
        );
    }
}