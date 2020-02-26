
import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
import { ConnectedEarnedPenaltyList } from "src/ConnectedComponents/Lists/Penalty/EarnedPenaltyList";
import { DocumentView } from "src/Components/Styled/Styled";

interface Props {
    navigation: any
}

export default class UnusedPenaltiesScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Pending Penalties',
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ConnectedEarnedPenaltyList 
                    navigation={this.props.navigation}
                    type={"active"}
                >
                </ConnectedEarnedPenaltyList>
            </DocumentView>
        );
    }
}