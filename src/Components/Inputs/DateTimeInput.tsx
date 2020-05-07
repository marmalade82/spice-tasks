import React from "react";
import { View, Text, StyleSheet, Modal, Button, StyleProp, ViewStyle } from "react-native";

import { ColumnView } from "src/Components/Basic/Basic";
import { Label, DateInput, TimeInput } from "src/Components/Styled/Styled";
import { Layout, Type, StyleSheetContext } from "src/Components/Styled/StyleSheets";

export interface Props {
    title: string;
    type: "date" | "time"
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

    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: Props) {
        super(props);

        this.state = {
        }

    }

    private icon = () => {
        if(this.props.failure !== undefined) {
            return "attention";
        }
    }

    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <ColumnView style={[Class.InputContainer, this.props.style]}
            >
                <Label text={this.props.title}></Label>
                {this.renderInput()}
            </ColumnView>
        );
    }

    private renderInput = () => {
        if(this.props.type === "date") {
            return (
                <DateInput
                    value={this.props.data}
                    onChangeDate={this.props.onDataChange}
                    format={"january 1st, 2020"}
                    accessibilityLabel={this.props.accessibilityLabel}
                    onBlur={this.props.onBlur}
                    icon={this.icon()}
                    readonly={this.props.readonly}
                ></DateInput>
            )
        } else {
            return (
                <TimeInput
                    value={this.props.data}
                    onChangeTime={this.props.onDataChange}
                    format={"12:00 AM"}
                    accessibilityLabel={this.props.accessibilityLabel}
                    onBlur={this.props.onBlur}
                    icon={this.icon()}
                    readonly={this.props.readonly}
                ></TimeInput>
            )
        }
    }
}

type DateProps = {
    label: string;
    value: Date
    onChange: (val: Date) => void;
    accessibilityLabel: string;
    valid: ["ok", string] | ["error", string]
    readonly: boolean
}

export const ADateInput: React.FunctionComponent<DateProps> = (props: DateProps) => {
    const { label, value, onChange, accessibilityLabel, valid, readonly} = props;

    return (
        <DateTimeInput
            title={label}
            data={value}
            onDataChange={onChange}
            accessibilityLabel={accessibilityLabel}
            success={(() => {
                return valid[0] === "ok";
            })()}
            failure={(() => {
                return valid[0] === "ok" ? undefined : valid[1];
            })()}
            type={"date"}
        ></DateTimeInput>
    )
}


type TimeProps = {
    label: string;
    value: Date
    onChange: (val: Date) => void;
    accessibilityLabel: string;
    valid: ["ok", string] | ["error", string]
    readonly: boolean
}

export const ATimeInput: React.FunctionComponent<TimeProps> = (props: TimeProps) => {
    const { label, value, onChange, accessibilityLabel, valid, readonly} = props;
    return (
        <DateTimeInput
            title={label}
            data={value}
            onDataChange={onChange}
            accessibilityLabel={accessibilityLabel}
            success={(() => {
                return valid[0] === "ok";
            })()}
            failure={(() => {
                return valid[0] === "ok" ? undefined : valid[1];
            })()}
            type={"time"}
        ></DateTimeInput>
    )
}