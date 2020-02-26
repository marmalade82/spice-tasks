
import React from "react";
import { ColumnView, RowView, Image, HeaderText, BodyText, } from "src/Components/Basic/Basic";
import { ConnectedEarnedRewardList } from "src/ConnectedComponents/Lists/Reward/EarnedRewardList";
import { DocumentView } from "src/Components/Styled/Styled";

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

    render = () => {
        return (
            <DocumentView>
                <ConnectedEarnedRewardList
                    navigation={this.props.navigation}
                    type={"active"}
                >
                </ConnectedEarnedRewardList>
            </DocumentView>
        );
    }
}