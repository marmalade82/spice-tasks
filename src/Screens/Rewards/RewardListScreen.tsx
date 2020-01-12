
import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
import { ConnectedRewardList } from "src/ConnectedComponents/Lists/Reward/RewardList";
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


export default class RewardListScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Rewards',
        }
    }

    render = () => {
        return (
            <View style={[Style.container, Style.yellowBg]}>
                <ConnectedRewardList 
                    navigation={this.props.navigation}
                >
                </ConnectedRewardList>
                <View style={style.button}>
                    <Button
                        title={"add"}
                        onPress={() => {
                            const params = {
                                id: ""
                            };
                            this.props.navigation.navigate('AddReward', params);
                        }}
                    />
                </View>
            </View>
        );
    }
}