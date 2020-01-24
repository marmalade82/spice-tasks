import React from "react";
import { Button, Text, View, FlatList} from "react-native";
import { 
    ColumnView, RowView, Image, 
    HeaderText, BodyText, ViewWizard 
} from "src/Components/Basic/Basic";
import {
    Die 
} from "src/Components/Images/Images";
import Style from "src/Style/Style";
import EarnedRewardSummary from "src/Components/Summaries/EarnedRewardSummary";
import TwoDiceRoll from "src/Components/EarnedRewards/TwoDice/TwoDiceRoll";

interface Props {
    navigation: any;
}

interface State {}


export default class TestScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Test',
        }
    }

    render = () => {
        return (
            <ColumnView style={{
                justifyContent: "flex-start"
            }}>
            </ColumnView>
        );
    }

}
