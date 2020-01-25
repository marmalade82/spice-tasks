import React from "react";
import { TouchableOpacity } from "react-native";
import { ColumnView, RowView, Image, HeaderText, BodyText, } from "src/Components/Basic/Basic";
import Style from "src/Style/Style";
import EarnedRewardSummary from "src/Components/Summaries/EarnedRewardSummary";
import EarnedRewardQuery, { EarnedReward } from "src/Models/Reward/EarnedRewardQuery";
import { ConnectedEarnedRewardSummary } from "src/ConnectedComponents/Summaries/EarnedRewardSummary";
import Goal from "src/Models/Goal/Goal";
import GoalQuery from "src/Models/Goal/GoalQuery";


interface Props {
    navigation: any;
}

interface State { 
    earnedReward? : EarnedReward;
    sourceGoal? : Goal;
}

export default class EarnedRewardScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Earned Reward',
        }
    }

    constructor(props: Props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount = async () => {
        const earned = await new EarnedRewardQuery().get(this.props.navigation.getParam("id", ""));
        if(earned) {
            this.setState({
                earnedReward: earned
            });

            const goal = await new GoalQuery().get(earned.goalId);
            if(goal) {
                this.setState({
                    sourceGoal: goal
                })
            } else {
                this.setState({
                    sourceGoal: undefined
                });
            }
        } else {
            this.setState({
                earnedReward: undefined
            });
        }
    }

    render = () => {
        return (
            <ColumnView style={{
                justifyContent: "flex-start"
            }}>
                {this.renderSummary()}
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

    renderSummary = () => {
        if(this.state.earnedReward && this.state.sourceGoal) {
            return (
                <ConnectedEarnedRewardSummary
                    earned={this.state.earnedReward}
                    style={{ flex: 9 }}
                    goal={this.state.sourceGoal}
                >
                </ConnectedEarnedRewardSummary>
            );
        }
    }
}