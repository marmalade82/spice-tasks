
import React from "react";
import { View, StyleProp, ViewStyle, Text } from "react-native";
import Style from "src/Style/Style";
import { RowView, ColumnView, Image, HeaderText, BodyText } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { Summary, IconButton } from "src/Components/Styled/Styled";
import { Navigation, ScreenParams } from "src/common/Navigator";


interface Props {
    style: StyleProp<ViewStyle>
    title: string;
    details: string;
    expireDate: Date;
    id: string;
    navigation: Navigation<ScreenParams>;
    onChoice: OnChoice;
}

export type OnChoice = (choice: "delete") => void;

interface State {

}

export default class PenaltySummary extends React.Component<Props, State> {
    
    getFooterElements = () => {
        return [
            () => { 
                return (
                    <IconButton type={"edit"}
                        onPress={() => {
                            this.props.navigation.push(
                                "AddPenalty", {
                                    id: this.props.id,
                                    parent_id: "",
                                }
                            );
                        }}
                        accessibilityLabel={"edit-penalty-button"}
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
                        accessibilityLabel={"delete-penalty-button"}
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