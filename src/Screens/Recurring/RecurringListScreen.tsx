
import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
import { ConnectedRecurList } from "src/ConnectedComponents/Lists/Recur/RecurList";
import { DocumentView } from "src/Components/Styled/Styled";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";


interface Props {
    navigation: object
}

export default class RecurListScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Recurring Goals',
        }
    }

    navigation: MainNavigator<"Recurrings">;
    constructor(props: Props) {
        super(props);
        this.navigation = new ScreenNavigation(props);
    }

    render = () => {
        return (
            <DocumentView accessibilityLabel={"recurrences"}>
                <ConnectedRecurList 
                    navigation={this.navigation}
                >
                </ConnectedRecurList>
            </DocumentView>
        );
    }
}
