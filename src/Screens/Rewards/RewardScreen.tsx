
import React from "react";
import RewardQuery, { Reward } from "src/Models/Reward/RewardQuery";
import RewardLogic from "src/Models/Reward/RewardLogic";
import { ConnectedRewardSummary } from "src/ConnectedComponents/Summaries/RewardSummary";
import Goal from "src/Models/Goal/Goal";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";


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

    navigation: MainNavigator<"Reward">;
    constructor(props: Props) {
        super(props);

        this.state = {

        }
        this.navigation = new ScreenNavigation(props);
    }

    componentDidMount = async () => {
        const reward = await new RewardQuery().get(this.navigation.getParam("id", ""));
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
            <DocumentView accessibilityLabel={"reward"}>
                {this.renderSummary()}
            </DocumentView>

        );
    }

    onChoice = (choice: "delete") => {
        const id = this.navigation.getParam("id", "");
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
                    navigation={this.navigation}
                    onChoice={this.onChoice}
                >
                </ConnectedRewardSummary>
            );
        }
    }

}