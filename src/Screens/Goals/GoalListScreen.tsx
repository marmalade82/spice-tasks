import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";
import { DocumentView } from "src/Components/Styled/Styled";
import { GoalLogic } from "src/Models/Goal/GoalQuery";

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

    onGoalAction = (id: string, action: "complete" | "fail") => {
        switch(action) {
            case "complete": {
                new GoalLogic(id).complete();
            } break;
            case "fail" : {
                new GoalLogic(id).fail();
            } break;
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ConnectedGoalList 
                    navigation={this.props.navigation}
                    onGoalAction = {this.onGoalAction}
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
            </DocumentView>
        );
    }
}
