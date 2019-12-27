import React from "react";
import { View, Text } from "react-native";



export default class GoalScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Goal',
        }
    }

    render = () => {
        return (
            <View>
                <Text>
                    Hi! Look at your goals! Actually it's just a goal.
                </Text>
            </View>
        );
    }
}