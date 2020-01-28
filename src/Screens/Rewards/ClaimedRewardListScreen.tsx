
import React from "react";
import { ColumnView, RowView, Image, HeaderText, BodyText, } from "src/Components/Basic/Basic";
import { ConnectedClaimedRewardList } from "src/ConnectedComponents/Lists/Reward/ClaimedRewardList";

interface Props {
    navigation: any;
}

interface State {

}


export default class ClaimedRewardListScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Claimed Rewards',
        }
    }

    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <ColumnView style={{ alignItems: "center" }}>
                <ConnectedClaimedRewardList
                    navigation={this.props.navigation}
                >
                </ConnectedClaimedRewardList>
            </ColumnView>
        );
    }
}