import React from "react";
import { Button } from "react-native";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props<T extends keyof ScreenParams> { 
    navigation: Navigation<ScreenParams>;
    title: string;
    color?: string;
    parameters: ScreenParams[T];
    destination: T;
    accessibilityLabel: string;
}


interface State { }

export default class NavigationButton <T extends keyof ScreenParams> extends React.Component<Props<T>, State> {


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