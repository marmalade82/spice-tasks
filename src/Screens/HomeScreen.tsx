import React from "react";
import Home from "src/Components/Home";
import { View, Button, StyleSheet } from "react-native";
import Style from "src/Style/Style";

interface Props {
    navigation: any;
}

const localStyle = StyleSheet.create({
    container: {
        justifyContent: "space-evenly",
        alignItems: "stretch",
    }
});

export default class HomeScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Home!',
        }
    }

    render = () => {
        return (
            <View style={[Style.container, localStyle.container]}>
                <Button 
                    title="Goal" 
                    onPress={() => this.props.navigation.navigate('Goal')}
                ></Button>
                <Button
                    title="Tasks"
                    onPress={() => this.props.navigation.navigate('Tasks')}
                ></Button>
            </View>
        )
    }
}