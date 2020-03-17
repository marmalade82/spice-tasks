import React from "react";
import Home from "src/Components/Home";
import { View, Button, StyleSheet } from "react-native";
import Style from "src/Style/Style";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";

interface Props {
    navigation: object;
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

    navigation: MainNavigator<"Home">;
    constructor(props: Props) {
        super(props);

        this.state = {
            screens: [
                'Dashboard' , "Task", "Rewards", "Test", "RewardOptions", "EarnedReward",
                'EarnedRewards', "Penalties", "AddPenalty", "HomePage", "AppStart", "Recurrings",
            ]
        }
        this.navigation = new ScreenNavigation(props);
    }

    renderScreenButtons = () => {
        return this.state.screens.map((screenName: string) => {
            return (
                <Button 
                    title={screenName}
                    onPress={() => this.navigation.navigate(screenName as any, {})}
                    key={screenName}
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