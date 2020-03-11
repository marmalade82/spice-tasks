import React from "react";
import EarnedRewardQuery, { EarnedReward } from "src/Models/Reward/EarnedRewardQuery";
import EarnedRewardLogic from "src/Models/Reward/EarnedRewardLogic";
import { ConnectedEarnedRewardSummary } from "src/ConnectedComponents/Summaries/EarnedRewardSummary";
import Goal from "src/Models/Goal/Goal";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";


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
                earnedReward: earned,
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

    onCompleteWizard = (result:{ reward: string[], penalty: string[]} ) => {
        // result shows the ids of rewards and penalties that were earned, so they 
        // can be created and shown.
        const { reward, penalty } = result;
        const earnedId = this.props.navigation.getParam("id", "");
        debugger;
        for(let i = 0; i < reward.length; i++) {
            void new EarnedRewardLogic(earnedId).claimReward(reward[i]);
        }

        for(let i = 0; i < penalty.length; i++) {
            void new EarnedRewardLogic(earnedId).claimPenalty(penalty[i]);
        }
    }

    render = () => {
        
        return (
            <DocumentView>
                {this.renderSummary()}
            </DocumentView>

        );
    }

    onChoice = (choice: "use") => {
        const id = this.props.navigation.getParam("id", "");
        switch(choice) {
            case "use": {
                void new EarnedRewardLogic(id).use();
                this.props.navigation.goBack();
            } break;
            default: {

            }
        }
    }

    renderSummary = () => {
        if(this.state.earnedReward && this.state.sourceGoal) {
            return (
                <ConnectedEarnedRewardSummary
                    earned={this.state.earnedReward}
                    style={{ flex: 9 }}
                    goal={this.state.sourceGoal}
                    navigation={this.props.navigation}
                    onChoice={this.onChoice}
                >
                </ConnectedEarnedRewardSummary>
            );
        }
    }
}