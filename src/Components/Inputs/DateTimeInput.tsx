import React from "react";
import { View, Text, StyleSheet, Modal, Button, StyleProp, ViewStyle } from "react-native";

import DateTimePicker from "src/Components/Inputs/DateTimePicker";
import ModalInput from "src/Components/Inputs/ModalInput";
import Style from "src/Style/Style";
import { ColumnView } from "src/Components/Basic/Basic";
import { Label, DateInput } from "src/Components/Styled/Styled";
import { CONTAINER_VERTICAL_MARGIN } from "src/Components/Styled/Styles";

export interface Props {
    title: string;
    type: "date" | "time" | "both"
    data: Date
    onDataChange: (date: Date) => void;
    accessibilityLabel: string;
    style?: StyleProp<ViewStyle>;
    success ? : boolean;
    failure ? : string;
    onBlur?: () => void;
    readonly?: boolean;
}

interface State {
}

export default class DateTimeInput extends React.Component<Props,State> {

    constructor(props: Props) {
        super(props);

        this.state = {
        }

    }

    icon = () => {
        if(this.props.failure !== undefined) {
            return "attention";
        }
    }

    render = () => {
        return (
            <ColumnView style={[{
                    flex: 0,
                    backgroundColor: "transparent",
                    marginBottom: 2 * CONTAINER_VERTICAL_MARGIN,
                }, this.props.style]}
            >
                <Label text={this.props.title}></Label>
                <DateInput
                    value={this.props.data}
                    onChangeDate={this.props.onDataChange}
                    format={"january 1st, 2020"}
                    accessibilityLabel={this.props.accessibilityLabel}
                    onBlur={this.props.onBlur}
                    icon={this.icon()}
                    readonly={this.props.readonly}
                ></DateInput>
            </ColumnView>
        );
    }
}