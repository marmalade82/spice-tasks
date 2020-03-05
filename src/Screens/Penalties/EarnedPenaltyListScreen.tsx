
import React from "react";
import { ColumnView, RowView, Image, HeaderText, BodyText, } from "src/Components/Basic/Basic";
import { ConnectedEarnedPenaltyList } from "src/ConnectedComponents/Lists/Penalty/EarnedPenaltyList";
import { DocumentView } from "src/Components/Styled/Styled";
import EarnedPenaltyLogic from "src/Models/Penalty/EarnedPenaltyLogic";

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

    onEarnedPenaltyAction = (id: string, action: "use") => {
        switch(action) {
            case "use": {
                void new EarnedPenaltyLogic(id).use();
            } break;
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ConnectedEarnedPenaltyList
                    navigation={this.props.navigation}
                    onEarnedPenaltyAction={this.onEarnedPenaltyAction}
                    onSwipeRight={(id: string) => {
                        this.onEarnedPenaltyAction(id, "use")
                    }}
                >
                </ConnectedEarnedPenaltyList>
            </DocumentView>
        );
    }
}