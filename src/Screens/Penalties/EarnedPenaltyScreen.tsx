
import React from "react";
import EarnedPenaltyQuery, { EarnedPenalty } from "src/Models/Penalty/EarnedPenaltyQuery";
import EarnedPenaltyLogic from "src/Models/Penalty/EarnedPenaltyLogic";
import { ConnectedEarnedPenaltySummary } from "src/ConnectedComponents/Summaries/EarnedPenaltySummary";
import Goal from "src/Models/Goal/Goal";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";


interface Props {
    navigation: any;
}

interface State { 
    earnedPenalty? : EarnedPenalty;
    sourceGoal? : Goal;
}

export default class EarnedPenaltyScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Earned Penalty',
        }
    }

    constructor(props: Props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount = async () => {
        const earned = await new EarnedPenaltyQuery().get(this.props.navigation.getParam("id", ""));
        if(earned) {
            this.setState({
                earnedPenalty: earned,
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
                earnedPenalty: undefined
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

    onChoice = (choice: "use") => {
        const id = this.props.navigation.getParam("id", "");
        switch(choice) {
            case "use": {
                void new EarnedPenaltyLogic(id).use();
                this.props.navigation.goBack();
            } break;
            default: {

            }
        }
    }

    renderSummary = () => {
        if(this.state.earnedPenalty && this.state.sourceGoal) {
            return (
                <ConnectedEarnedPenaltySummary
                    earned={this.state.earnedPenalty}
                    style={{ flex: 9 }}
                    goal={this.state.sourceGoal}
                    navigation={this.props.navigation}
                    onChoice={this.onChoice}
                >
                </ConnectedEarnedPenaltySummary>
            );
        }
    }

}