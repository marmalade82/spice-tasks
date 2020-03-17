
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Style from "src/Style/Style";
import {
    ColumnView, RowView, BodyText,
} from "src/Components/Basic/Basic";
import { Summary, IconButton, ModalIconButton, ModalRow } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";
import { booleanLiteral } from "@babel/types";
import v from "voca";
import { Navigation, ScreenParams } from "src/common/Navigator";

export type ModalChoices = "enable" | "disable" | "delete"

interface Props {
    recur: Recur
    navigation: Navigation<ScreenParams>;
    onModalChoice: (s: ModalChoices) => void;
}

interface State {
    showMore: boolean;
}

interface Recur {
    id: string;
    active: boolean;
    title: string;
    details: string;
    type: "daily" | "weekly" | "monthly";
}



export default class RecurSummary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showMore: false,
        }
    }


    render = () => {
        const { id, title, active, details, type } = this.props.recur;
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
                                {v.capitalize(type) + "\n" + details + "\n" + (active ? "Enabled" : "Disabled")}
                            </BodyText>
                        </Text>
                    );
                }}
                footerElements={[
                    () => { 
                        return (
                            <IconButton type={"edit"}
                                onPress={() => {
                                    this.props.navigation.push(
                                        "AddRecur", {
                                            id: id,
                                            parent_id: "",
                                        }
                                    );
                                }}
                                accessibilityLabel={"edit-recur-button"}
                                key={"edit"}
                            >

                            </IconButton>
                        );
                    },
                    () => { 
                        if(this.props.recur.active) {
                            return (
                                <IconButton type={"disable"}
                                    onPress={() => {
                                        this.props.onModalChoice("disable");
                                    }}
                                    accessibilityLabel={"disable-recur-button"}
                                    key={"disable"}
                                ></IconButton>
                            );
                        } else {
                            return (
                                <IconButton type={"enable"}
                                    onPress={() => {
                                        this.props.onModalChoice("enable");
                                    }}
                                    accessibilityLabel={"enable-recur-button"}
                                    key={"enable"}
                                ></IconButton>
                            );
                        }
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
                                        accessibilityLabel={"recur-more-button"}
                                        key={"more"}
                                    >
                                        <ModalRow
                                            text={"Delete"}
                                            iconType={"delete"}
                                            onPress={() => {
                                                this.props.onModalChoice("delete");
                                                this.setState({
                                                    showMore: false,
                                                })
                                            }}
                                            accessibilityLabel={"recur-delete-button"}
                                        ></ModalRow>
                                    </ModalIconButton>
                            );
                    },
                ]}
            ></Summary>
        );
    }
}

export {
    RecurSummary
}