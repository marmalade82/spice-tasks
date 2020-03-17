import React from "react";
import { View, Text, Button } from "react-native";
import Style from "src/Style/Style";

interface Props {
    navigation: object;
}

interface State {
}

export default class MenuScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

    }
    
    navigate = (screen: string) => {
        this.props.navigation.navigate(screen);
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
            </View>
        )
    }
}