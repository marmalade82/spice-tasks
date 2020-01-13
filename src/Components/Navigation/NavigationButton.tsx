import React from "react";
import { Button } from "react-native";

interface Empty {

}

interface Props { 
    navigation: any;
    title: string;
    color?: string;
    parameters: Empty;
    destination: string;
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
            ></Button>   
        );
    }
}