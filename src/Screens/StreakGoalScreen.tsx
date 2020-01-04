import React from "react";
import { View } from "react-native";
import Style from "../../styles/Style";
import StreakForm from "../../components/forms/AddGoalForm/StreakForm";


export default class StreakGoalScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'StreakScreen',
        }
    }

    render = () => {
        return (
            <View style={[Style.container, Style.yellowBg]}>
                <StreakForm></StreakForm>
            </View>
        );
    }
}