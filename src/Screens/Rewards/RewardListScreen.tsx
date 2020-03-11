
import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
import { ConnectedRewardList } from "src/ConnectedComponents/Lists/Reward/RewardList";
import Style from "src/Style/Style";
import { DocumentView } from "src/Components/Styled/Styled";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { EventDispatcher } from "src/common/EventDispatcher";
import { getKey } from "../common/screenUtils";

interface Props {
    navigation: any
}


const dispatcher = new EventDispatcher();

export default class RewardListScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Rewards',
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
        dispatcher.addEventListener(getKey(this.props.navigation), this.onClickAdd)
    }

    componentWillUnmount = () => {
        dispatcher.addEventListener(getKey(this.props.navigation), this.onClickAdd)
    }

    onClickAdd = () => {
        const params = {
            id: ""
        };
        this.props.navigation.navigate('AddReward', params);
    }

    render = () => {
        return (
            <DocumentView>
                <ConnectedRewardList 
                    navigation={this.props.navigation}
                >
                </ConnectedRewardList>
            </DocumentView>
        );
    }
}