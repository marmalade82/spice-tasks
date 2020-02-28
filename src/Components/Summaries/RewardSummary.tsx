
import React from "react";
import { View, StyleProp, ViewStyle, Text } from "react-native";
import Style from "src/Style/Style";
import { RowView, ColumnView, Image, HeaderText, BodyText } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { Summary, IconButton } from "src/Components/Styled/Styled";


interface Props {
    style: StyleProp<ViewStyle>
    title: string;
    details: string;
    expireDate: Date
    navigation: any;
    onChoice: OnChoice;
}

export type OnChoice = (choice: "delete") => void;

interface State {

}

export default class RewardSummary extends React.Component<Props, State> {
    
    getFooterElements = () => {
        return [
            () => { 
                return (
                    <IconButton type={"edit"}
                        onPress={() => {
                            this.props.navigation.push(
                                "AddReward", {
                                    id: this.props.navigation.getParam('id', ''),
                                }
                            );
                        }}
                        accessibilityLabel={"edit-reward-button"}
                        key={"edit"}
                    >

                    </IconButton>
                );
            },
            () => {
                return (
                    <IconButton type={"delete"}
                        onPress={() => {
                            this.props.onChoice("delete");
                        }}
                        accessibilityLabel={"delete-reward-button"}
                        key={"complete"}
                    ></IconButton>
                );
            }
        ];
    }

    render = () => {
        const { title, details} = this.props;
        return (
            <Summary
                style={{}}
                headerText={title}
                bodyText={() => {
                    return (
                        <Text>
                            <BodyText
                                style={{}}
                            >
                                {details}
                            </BodyText>
                        </Text>
                    );
                }}
                footerElements={ this.getFooterElements() }
            >

            </Summary>
        )
    }
}