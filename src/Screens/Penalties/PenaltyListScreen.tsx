
import React from "react";
import {View, Button, Text, StyleSheet } from "react-native";
import { ConnectedPenaltyList } from "src/ConnectedComponents/Lists/Penalty/PenaltyList";
import Style from "src/Style/Style";
import { DocumentView } from "src/Components/Styled/Styled";

interface Props {
    navigation: any
}

const style = StyleSheet.create({
    button: {
        position: 'absolute',
        right: 25,
        bottom: 25,
    }
});


export default class PenaltyListScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Penalties',
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ConnectedPenaltyList 
                    navigation={this.props.navigation}
                >
                </ConnectedPenaltyList>
                <View style={style.button}>
                    <Button
                        title={"add"}
                        onPress={() => {
                            const params = {
                                id: ""
                            };
                            this.props.navigation.navigate('AddPenalty', params);
                        }}
                    />
                </View>
            </DocumentView>
        );
    }
}