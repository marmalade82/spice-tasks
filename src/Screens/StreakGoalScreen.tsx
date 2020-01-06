import React from "react";
import { View } from "react-native";
import Style from "src/Style/Style";
import StreakForm from "src/Components/Forms/AddGoalForm/StreakForm";


export default class StreakGoalScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'StreakScreen',
        }
    }

    render = () => {
        return (
            <View style={[Style.container, Style.yellowBg]}>
                <StreakForm
                    onDataChange={() => {}}
                >

                </StreakForm>
            </View>
        );
    }
}