import React from "react";
import Home from "src/Components/Home";
import { View, Button } from "react-native";
import Style from "src/Style/Style";

interface Props {
    navigation: any;
}

export default class HomeScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Home!',
        }
    }

    render = () => {
        return (
            <View style={[Style.container]}>
                <Home></Home>
                <Button 
                    title="Goal" 
                    onPress={() => this.props.navigation.navigate('Goal')}
                >

                </Button>
            </View>
        )
    }
}