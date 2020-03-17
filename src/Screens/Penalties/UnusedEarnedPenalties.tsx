
import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
import { ConnectedEarnedPenaltyList } from "src/ConnectedComponents/Lists/Penalty/EarnedPenaltyList";
import { DocumentView } from "src/Components/Styled/Styled";
import EarnedPenaltyLogic from "src/Models/Penalty/EarnedPenaltyLogic";

interface Props {
    navigation: object
}

export default class UnusedPenaltiesScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Pending Penalties',
        }
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