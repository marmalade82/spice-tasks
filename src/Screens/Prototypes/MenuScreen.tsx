import React from "react";
import { View, Text, Button } from "react-native";
import Style from "src/Style/Style";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";

interface Props {
    navigation: object;
}

interface State {
}

export default class MenuScreen extends React.Component<Props, State> {
    navigation: MainNavigator<"Menu">
    constructor(props: Props) {
        super(props);
        this.navigation = new ScreenNavigation(props);
    }
    
    navigate = (screen: string) => {
        this.navigation.navigate(screen as any, {});
    }

    render = () => {

        return (
            <View style={Style.topDownSpaced}>
                <Button title="Home" onPress={() => {this.navigate('Home')}}></Button>
                <Button title="Add Task" onPress={() => {this.navigate('AddTask')}}></Button>
                <Button title="Goals" onPress={() => {this.navigate('Goals')}}> </Button>
                <Button title="Add Goal" onPress={() => {this.navigate('AddGoal')}}></Button>
                <Button title="Goal" onPress={() => {this.navigate('Goal')}}></Button>
                <Button title="Recurring" onPress={() => {this.navigate('Recurring')}}></Button>
                <Button title="Streak" onPress={() => {this.navigate('Streak')}}></Button>
                <Button title="Cycles" onPress={() => {this.navigate("StreakCycles")}}></Button>
            </View>
        )
    }
}