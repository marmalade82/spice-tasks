import React from "react";
import EarnedRewardQuery, { EarnedReward } from "src/Models/Reward/EarnedRewardQuery";
import EarnedRewardLogic from "src/Models/Reward/EarnedRewardLogic";
import { ConnectedEarnedRewardSummary } from "src/ConnectedComponents/Summaries/EarnedRewardSummary";
import Goal from "src/Models/Goal/Goal";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";


interface Props {
    navigation: object;
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

    navigation: MainNavigator<"EarnedReward">
    constructor(props: Props) {
        super(props);

        this.state = {

        }
        this.navigation = new ScreenNavigation(props);
    }

    componentDidMount = async () => {
        const earned = await new EarnedRewardQuery().get(this.navigation.getParam("id", ""));
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

    render = () => {
        
        return (
            <DocumentView>
                {this.renderSummary()}
            </DocumentView>

        );
    }

    private onChoice = (choice: "use") => {
        const id = this.navigation.getParam("id", "");
        switch(choice) {
            case "use": {
                void new EarnedRewardLogic(id).use();
                this.navigation.goBack();
            } break;
            default: {

            }
        }
    }

    private renderSummary = () => {
        if(this.state.earnedReward && this.state.sourceGoal) {
            return (
                <ConnectedEarnedRewardSummary
                    earned={this.state.earnedReward}
                    style={{ flex: 9 }}
                    goal={this.state.sourceGoal}
                    navigation={this.navigation}
                    onChoice={this.onChoice}
                >
                </ConnectedEarnedRewardSummary>
            );
        }
    }
}