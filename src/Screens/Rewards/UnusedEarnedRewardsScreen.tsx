
import React from "react";
import { ColumnView, RowView, Image, HeaderText, BodyText, } from "src/Components/Basic/Basic";
import { ConnectedEarnedRewardList } from "src/ConnectedComponents/Lists/Reward/EarnedRewardList";
import { DocumentView } from "src/Components/Styled/Styled";
import { EarnedReward } from "src/Screens";
import EarnedRewardLogic from "src/Models/Reward/EarnedRewardLogic";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";

interface Props {
    navigation: object;
}

interface State {

}


export default class UnusedEarnedRewardsScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Unused Rewards',
        }
    }

    navigation: MainNavigator<"UnusedEarnedRewards">
    constructor(props: Props) {
        super(props);
        this.navigation = new ScreenNavigation(props);
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
            <DocumentView accessibilityLabel="unused-earned-reward">
                <ConnectedEarnedRewardList
                    navigation={this.navigation}
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