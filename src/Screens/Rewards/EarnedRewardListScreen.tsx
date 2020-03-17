import React from "react";
import { ColumnView, RowView, Image, HeaderText, BodyText, } from "src/Components/Basic/Basic";
import { ConnectedEarnedRewardList } from "src/ConnectedComponents/Lists/Reward/EarnedRewardList";
import { DocumentView } from "src/Components/Styled/Styled";
import EarnedRewardLogic from "src/Models/Reward/EarnedRewardLogic";

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

    constructor(props: Props) {
        super(props);
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
            <DocumentView>
                <ConnectedEarnedRewardList
                    navigation={this.props.navigation}
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