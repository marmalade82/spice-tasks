
import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
import { ConnectedRecurList } from "src/ConnectedComponents/Lists/Recur/RecurList";
import { DocumentView } from "src/Components/Styled/Styled";


interface Props {
    navigation: any
}

export default class RecurListScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Recurring Goals',
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ConnectedRecurList 
                    navigation={this.props.navigation}
                >
                </ConnectedRecurList>
            </DocumentView>
        );
    }
}
