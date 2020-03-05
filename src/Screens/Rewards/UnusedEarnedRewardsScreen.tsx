
import React from "react";
import { ColumnView, RowView, Image, HeaderText, BodyText, } from "src/Components/Basic/Basic";
import { ConnectedEarnedRewardList } from "src/ConnectedComponents/Lists/Reward/EarnedRewardList";
import { DocumentView } from "src/Components/Styled/Styled";
import { EarnedReward } from "src/Screens";
import EarnedRewardLogic from "src/Models/Reward/EarnedRewardLogic";

interface Props {
    navigation: any;
}

interface State {

}


export default class UnusedEarnedRewardsScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Unused Rewards',
        }
    }

    constructor(props: Props) {
        super(props);
    }

    onEarnedRewardAction = (id: string, action: "use") => {
        switch(action) {
            case "use": {
                void new EarnedRewardLogic(id).use();
            } break;
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ConnectedEarnedRewardList
                    navigation={this.props.navigation}
                    type={"active"}
                    onEarnedRewardAction={this.onEarnedRewardAction}
                    onSwipeRight={(id) => {
                        this.onEarnedRewardAction(id, "use")
                    }}
                >
                </ConnectedEarnedRewardList>
            </DocumentView>
        );
    }
}