import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";
import GoalList from "src/Components/Lists/GoalList";
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
                    navigation={this.props.navigation}
                >
                </ConnectedGoalList>
                <View style={style.button}>
                    <Button
                        title={"add"}
                        onPress={() => {
                            const params = {
                                id: ""
                            };
                            this.props.navigation.navigate('AddGoal', params);
                        }}
                    />
                </View>
            </View>
        );
    }
}

/*

                */