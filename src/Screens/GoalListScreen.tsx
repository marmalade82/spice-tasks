import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/GoalList";
import Style from "src/Style/Style";

interface Props {
    navigation: any
}

const style = StyleSheet.create({
    button: {
        position: 'absolute',
        right: 25,
        bottom: 25,
    }
});

export default class GoalListScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Goals',
        }
    }

    render = () => {
        return (
            <View style={[Style.container, Style.yellowBg]}>
                <ConnectedGoalList 
                >
                </ConnectedGoalList>
                <View style={style.button}>
                    <Button
                        title={"add"}
                        onPress={() => {this.props.navigation.navigate('AddGoal')}}
                    />
                </View>
            </View>
        );
    }
}

