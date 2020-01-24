import React from "react";
import Home from "src/Components/Home";
import { View, Button, StyleSheet } from "react-native";
import Style from "src/Style/Style";

interface Props {
    navigation: any;
}

interface State {
    screens: string[]
}

const localStyle = StyleSheet.create({
    container: {
        justifyContent: "space-evenly",
        alignItems: "stretch",
    }
});

export default class HomeScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Home!',
        }
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            screens: [
                'Dashboard', 'Goal', "Tasks", "Task", "Rewards", "Test", "RewardOptions", "EarnedReward",
                'EarnedRewards',
            ]
        }
    }

    renderScreenButtons = () => {
        return this.state.screens.map((screenName: string) => {
            return (
                <Button 
                    title={screenName}
                    onPress={() => this.props.navigation.navigate(screenName)}
                ></Button>
            );
        });
    }

    render = () => {
        return (
            <View style={[Style.container, localStyle.container]}>
                {this.renderScreenButtons()}
            </View>
        )
    }
}