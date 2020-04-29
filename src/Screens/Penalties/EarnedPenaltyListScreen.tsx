
import React from "react";
import { ColumnView, RowView, Image, HeaderText, BodyText, } from "src/Components/Basic/Basic";
import { ConnectedEarnedPenaltyList } from "src/ConnectedComponents/Lists/Penalty/EarnedPenaltyList";
import { DocumentView } from "src/Components/Styled/Styled";
import EarnedPenaltyLogic from "src/Models/Penalty/EarnedPenaltyLogic";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";

interface Props {
    navigation: object;
}

interface State {

}


export default class EarnedPenaltyListScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Earned Penalties',
        }
    }

    navigation: MainNavigator<"EarnedPenalties">
    constructor(props: Props) {
        super(props);
        this.navigation = new ScreenNavigation(props);
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
            <DocumentView accessibilityLabel={"earned-penalties"}>
                <ConnectedEarnedPenaltyList
                    navigation={this.navigation}
                    onEarnedPenaltyAction={this.onEarnedPenaltyAction}
                    onSwipeRight={(id: string) => {
                        this.onEarnedPenaltyAction(id, "use")
                    }}
                    type={this.navigation.getParam("type", undefined) as any}
                >
                </ConnectedEarnedPenaltyList>
            </DocumentView>
        );
    }
}