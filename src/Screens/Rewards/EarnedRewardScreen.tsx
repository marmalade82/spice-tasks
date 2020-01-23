import React from "react";
import { TouchableOpacity } from "react-native";
import { ColumnView, RowView, Image, HeaderText, BodyText, } from "src/Components/Basic/Basic";
import Style from "src/Style/Style";
import EarnedRewardSummary from "src/Components/Summaries/EarnedRewardSummary";


interface Props {
    navigation: any;
}

interface State { 

}

export default class EarnedRewardScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Earned Reward',
        }
    }

    render = () => {
        return (
            <ColumnView style={{
                justifyContent: "flex-start"
            }}>
                <EarnedRewardSummary 
                    style={{ flex: 9 }}
                    rewardType={"two_dice"}
                    goalName={"Go to the gym every day for a week"}
                    earnedDate={new Date()}
                >
                </EarnedRewardSummary>
                <RowView style={{
                    flex: 10
                }}>
                    <ColumnView style={{
                        justifyContent: "flex-start",
                        alignItems: "center"
                    }}>
                        <TouchableOpacity style={{
                            flex:0,
                            height: 150,
                            width: 150,
                            margin: 0,
                            padding: 10,
                        }}>
                            <ColumnView style={{
                                borderRadius: 65,
                                height: 130,
                                width: 130,
                                alignItems: "center",
                                backgroundColor: "pink",
                                elevation: 4,
                            }}>
                                    <BodyText style={{}}>CLAIM</BodyText>
                            </ColumnView>
                        </TouchableOpacity>
                    </ColumnView>
                </RowView>
                <RowView style={{
                    flex: 6
                }}></RowView>
            </ColumnView>

        );
    }
}