
import React from "react";
import { View, StyleProp, ViewStyle, Text } from "react-native";
import Style from "src/Style/Style";
import { RowView, ColumnView, Image, HeaderText, BodyText } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { Summary, IconButton, ModalIconButton, ModalRow } from "src/Components/Styled/Styled";
import { Navigation, ScreenParams } from "src/common/Navigator";


interface Props {
    id: string;
    style: StyleProp<ViewStyle>
    title: string;
    details: string;
    expireDate: Date
    navigation: Navigation<ScreenParams>;
    onChoice: OnChoice;
}

export type OnChoice = (choice: "delete") => void;

interface State {
    showMore: boolean
}

export default class RewardSummary extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            showMore: false,
        }
    }
    
    getFooterElements = () => {
        return [
            () => { 
                return (
                    <IconButton type={"edit"}
                        onPress={() => {
                            this.props.navigation.push(
                                "AddReward", {
                                    id: this.props.id,
                                    parent_id: "",
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
            },
            () => { return (
                            <ModalIconButton type={"more"}
                                data={{
                                    showModal: this.state.showMore
                                }}
                                onDataChange={({showModal}) => {
                                    this.setState({
                                        showMore: showModal
                                    })
                                }}
                                accessibilityLabel={"reward-more-button"}
                                key={"more"}
                            >
                                <ModalRow
                                    text={"Edit"}
                                    iconType={"edit"}
                                    onPress={() => {
                                        this.props.navigation.push(
                                            "AddReward", {
                                                id: this.props.id,
                                                parent_id: "",
                                            }
                                        );
                                        this.setState({
                                            showMore: false,
                                        })
                                    }}
                                    accessibilityLabel={"edit-reward-button"}
                                    key={"edit"}
                                ></ModalRow>
                                <ModalRow
                                    text={"Delete"}
                                    iconType={"delete"}
                                    onPress={() => {
                                        this.props.onChoice("delete");
                                        this.setState({
                                            showMore: false,
                                        })
                                    }}
                                    accessibilityLabel={"delete-reward-button"}
                                    key={"delete"}
                                ></ModalRow>
                            </ModalIconButton>
                    );
            },
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