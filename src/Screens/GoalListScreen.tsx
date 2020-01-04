import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
//import GoalList from "../components/GoalList";
import GoalList from "../../components/lists/GoalList/GoalList";
import Style from "../../styles/Style";

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
                <GoalList 
                    registerChild={() => {return () => {}}}
                    initialData={{title: "hi"}}
                >
                </GoalList>
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

