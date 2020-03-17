
import React from "react";
import RewardQuery, { Reward } from "src/Models/Reward/RewardQuery";
import RewardLogic from "src/Models/Reward/RewardLogic";
import { ConnectedRewardSummary } from "src/ConnectedComponents/Summaries/RewardSummary";
import Goal from "src/Models/Goal/Goal";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";


interface Props {
    navigation: object;
}

interface State { 
    reward? : Reward;
}

export default class RewardScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Reward',
        }
    }

    constructor(props: Props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount = async () => {
        const reward = await new RewardQuery().get(this.props.navigation.getParam("id", ""));
        if(reward) {
            this.setState({
                reward: reward,
            });

        } else {
            this.setState({
                reward: undefined
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

    onChoice = (choice: "delete") => {
        const id = this.props.navigation.getParam("id", "");
        switch(choice) {
            case "delete": {

            } break;
            default: {

            }
        }
    }

    renderSummary = () => {
        if(this.state.reward) {
            return (
                <ConnectedRewardSummary
                    reward={this.state.reward}
                    style={{ flex: 9 }}
                    navigation={this.props.navigation}
                    onChoice={this.onChoice}
                >
                </ConnectedRewardSummary>
            );
        }
    }

}