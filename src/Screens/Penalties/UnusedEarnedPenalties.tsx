
import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
import { ConnectedEarnedPenaltyList } from "src/ConnectedComponents/Lists/Penalty/EarnedPenaltyList";
import { DocumentView } from "src/Components/Styled/Styled";
import EarnedPenaltyLogic from "src/Models/Penalty/EarnedPenaltyLogic";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";

interface Props {
    navigation: object
}

export default class UnusedPenaltiesScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Pending Penalties',
        }
    }

    navigation: MainNavigator<"UnusedEarnedPenalties">;
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
            <DocumentView>
                <ConnectedEarnedPenaltyList 
                    navigation={this.navigation}
                    type={"active"}
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