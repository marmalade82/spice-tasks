import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";
import { DocumentView, Icon } from "src/Components/Styled/Styled";
import { GoalLogic } from "src/Models/Goal/GoalQuery";
import { NavigationStackProp } from "react-navigation-stack";
import { Single, Child, None } from "App";
import { EventDispatcher } from "src/common/EventDispatcher";
import { TouchableView } from "src/Components/Basic/Basic";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";



interface Props {
    navigation: NavigationStackProp<None>
}

const dispatcher = new EventDispatcher();

export default class GoalListScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Goals',
            right: [
                () => {
                    return (
                        <HeaderAddButton
                            dispatcher={dispatcher}
                            eventName={getKey(navigation)}
                        ></HeaderAddButton>
                    )
                }
            ]
        }
    }

    componentDidMount = () => {
        dispatcher.addEventListener(getKey(this.props.navigation), this.onClickAdd);
    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.props.navigation) , this.onClickAdd);
    }

    onClickAdd = () => {
        const params = {
            id: ""
        };
        this.props.navigation.navigate('AddGoal', params);
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
            </DocumentView>
        );
    }
}
