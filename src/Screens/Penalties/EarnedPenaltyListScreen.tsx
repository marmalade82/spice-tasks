
import React from "react";
import { ColumnView, RowView, Image, HeaderText, BodyText, } from "src/Components/Basic/Basic";
import { ConnectedEarnedPenaltyList } from "src/ConnectedComponents/Lists/Penalty/EarnedPenaltyList";
import { DocumentView } from "src/Components/Styled/Styled";

interface Props {
    navigation: any;
}

interface State {

}


export default class EarnedPenaltyListScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Earned Penalties',
        }
    }

    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <DocumentView>
                <ConnectedEarnedPenaltyList
                    navigation={this.props.navigation}
                >
                </ConnectedEarnedPenaltyList>
            </DocumentView>
        );
    }
}