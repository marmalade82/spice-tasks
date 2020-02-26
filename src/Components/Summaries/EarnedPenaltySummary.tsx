
import React from "react";
import { View, StyleProp, ViewStyle, Text } from "react-native";
import Style from "src/Style/Style";
import { RowView, ColumnView, Image, HeaderText, BodyText } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { Summary, IconButton } from "src/Components/Styled/Styled";


interface Props {
    style: StyleProp<ViewStyle>
    penaltyType:  "specific"
    goalName: string;
    title: string;
    details: string;
    earnedDate: Date
    navigation: any;
    onChoice: OnChoice;
    active: boolean;
}

export type OnChoice = (choice: "use") => void;

interface State {

}

export default class EarnedPenaltySummary extends React.Component<Props, State> {
    

    getFooterElements = () => {
        if(this.props.active) {
            return [
                () => { 
                    return (
                        <IconButton type={"complete"}
                            onPress={() => {
                                this.props.onChoice("use");
                            }}
                            accessibilityLabel={"use-penalty-button"}
                            key={"complete"}
                        ></IconButton>
                    );
                },
            ]
        } else {
            return [

            ];
        }
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