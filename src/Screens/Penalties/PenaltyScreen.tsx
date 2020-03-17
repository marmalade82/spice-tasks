

import React from "react";
import PenaltyQuery, { Penalty } from "src/Models/Penalty/PenaltyQuery";
import PenaltyLogic from "src/Models/Penalty/PenaltyLogic";
import { ConnectedPenaltySummary } from "src/ConnectedComponents/Summaries/PenaltySummary";
import Goal from "src/Models/Goal/Goal";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";


interface Props {
    navigation: object;
}

interface State { 
    penalty? : Penalty;
}

export default class PenaltyScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Penalty',
        }
    }

    navigation: MainNavigator<"Penalty">
    constructor(props: Props) {
        super(props);

        this.state = {

        }
        this.navigation = new ScreenNavigation(props);
    }

    componentDidMount = async () => {
        const penalty = await new PenaltyQuery().get(this.navigation.getParam("id", ""));
        if(penalty) {
            this.setState({
                penalty: penalty,
            });

        } else {
            this.setState({
                penalty: undefined
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
        const id = this.navigation.getParam("id", "");
        switch(choice) {
            case "delete": {

            } break;
            default: {

            }
        }
    }

    renderSummary = () => {
        if(this.state.penalty) {
            return (
                <ConnectedPenaltySummary
                    penalty={this.state.penalty}
                    style={{ flex: 9 }}
                    navigation={this.navigation}
                    onChoice={this.onChoice}
                >
                </ConnectedPenaltySummary>
            );
        }
    }

}