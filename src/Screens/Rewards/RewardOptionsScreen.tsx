
import React from "react";
import { ColumnView, FreeTextView, HeaderText, BodyText } from "src/Components/Basic/Basic";
import { ScrollView, Text, StyleSheet, } from "react-native";

interface Props {
    navigation: any;
}

const localStyle = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
    }
})

export default class RewardListScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Reward Options',
        }
    }

    render = () => {
        return (
            <ColumnView style={[localStyle.container]}>
                <ScrollView>
                    <ColumnView style={[localStyle.container]}>
                        <FreeTextView style={{}}>
                            <HeaderText level={3} style={{}}>Dice Roll</HeaderText>
                            <BodyText style={{}}>
                                Randomly selects from nine rewards and one penalty.
                                Roll 2 or 12 for the penalty, or
                                3 through 11 for one of the rewards.
                            </BodyText>
                        </FreeTextView>
                    </ColumnView>
                    <ColumnView style={[localStyle.container]}>
                        <FreeTextView style={{}}>
                            <HeaderText level={3} style={{}}>Lootbox</HeaderText>
                            <BodyText style={{}}>
                                Open the box for three random rewards, but &#8230; 
                                you only get to choose one.
                            </BodyText>
                        </FreeTextView>
                    </ColumnView>
                    <ColumnView style={[localStyle.container]}>
                        <FreeTextView style={{}}>
                            <HeaderText level={3} style={{}}>Heads or Tails</HeaderText>
                            <BodyText style={{}}>
                                Choose a reward and a penalty,
                                and assign one to heads and one to tails. You can flip once,
                                twice, or not at all.
                            </BodyText>
                        </FreeTextView>
                    </ColumnView>
                    <ColumnView style={[localStyle.container]}>
                        <FreeTextView style={{}}>
                            <HeaderText level={3} style={{}}>Spin the Wheel</HeaderText>
                            <BodyText style={{}}>
                                Leave it all up to chance. There is a small chance of
                                a penalty, and a large chance of a reward.
                            </BodyText>
                        </FreeTextView>
                    </ColumnView>
                    <ColumnView style={[localStyle.container]}>
                        <FreeTextView style={{}}>
                            <HeaderText level={3} style={{}}>My Way or the Highway</HeaderText>
                            <BodyText style={{}}>
                                Least exciting but most assured. Choose the specific 
                                reward you want for completing your goal.
                            </BodyText>
                        </FreeTextView>
                    </ColumnView>
                    <ColumnView style={{
                        flex:0, // this serves as a bottom margin
                        height:90
                    }}></ColumnView>
                </ScrollView>
            </ColumnView>
        );
    }
}