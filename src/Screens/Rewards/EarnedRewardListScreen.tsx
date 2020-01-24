import React from "react";
import { ColumnView, RowView, Image, HeaderText, BodyText, } from "src/Components/Basic/Basic";
import { ConnectedEarnedRewardList } from "src/ConnectedComponents/Lists/Reward/EarnedRewardList";
import Style from "src/Style/Style";

interface Props {
    navigation: any;
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

    render = () => {
        return (
            <ColumnView style={{}}>
                <ConnectedEarnedRewardList
                    navigation={this.props.navigation}
                >
                </ConnectedEarnedRewardList>
            </ColumnView>
        );
    }
}