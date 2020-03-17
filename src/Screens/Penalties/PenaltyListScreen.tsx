
import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
import { ConnectedPenaltyList } from "src/ConnectedComponents/Lists/Penalty/PenaltyList";
import { DocumentView } from "src/Components/Styled/Styled";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";

interface Props {
    navigation: object
}

const style = StyleSheet.create({
    button: {
        position: 'absolute',
        right: 25,
        bottom: 25,
    }
});

const dispatcher = new EventDispatcher();

export default class PenaltyListScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Penalties',
            right: [
                () => {
                    return (
                        <HeaderAddButton
                            dispatcher={dispatcher}
                            eventName={getKey(navigation)}
                        ></HeaderAddButton>
                    )
                }
            ]
        }
    }


    navigation: MainNavigator<"Penalties">
    constructor(props: Props) {
        super(props);
        this.navigation = new ScreenNavigation(props);
    }

    componentDidMount = () => {
        dispatcher.addEventListener(getKey(this.navigation), this.onClickAdd);
    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.navigation), this.onClickAdd);
    }

    onClickAdd = () => {
        const params = {
            id: "",
            parent_id: "",
        };
        this.navigation.navigate('AddPenalty', params);
    }

    render = () => {
        return (
            <DocumentView>
                <ConnectedPenaltyList 
                    navigation={this.navigation}
                >
                </ConnectedPenaltyList>
            </DocumentView>
        );
    }
}