import React from "react";
import { ColumnView, RowView, Image, HeaderText, BodyText, } from "src/Components/Basic/Basic";
import { ConnectedEarnedRewardList } from "src/ConnectedComponents/Lists/Reward/EarnedRewardList";
import { DocumentView } from "src/Components/Styled/Styled";
import EarnedRewardLogic from "src/Models/Reward/EarnedRewardLogic";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";

interface Props {
    navigation: object;
}

interface State {

}


export default class EarnedRewardListScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Earned Rewards',
        }
    }

    navigation: MainNavigator<"EarnedRewards">
    constructor(props: Props) {
        super(props);
        this.navigation = new ScreenNavigation(props);
    }

    onEarnedRewardAction = (id: string, action: "use") => {
        switch(action) {
            case "use": {
                new EarnedRewardLogic(id).use();
            } break;
        }
    }

    render = () => {
        return (
            <DocumentView accessibilityLabel={"earned-rewards"}>
                <ConnectedEarnedRewardList
                    navigation={this.navigation}
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