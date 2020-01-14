import React from "react";
import { View, Text, StyleSheet, Modal, Button } from "react-native";

import DateTimePicker from "src/Components/Inputs/DateTimePicker";
import ModalInput from "src/Components/Inputs/ModalInput";
import Style from "src/Style/Style";

interface Props {
    title: string;
    type: "date" | "time" | "both"
    value: Date
    onValueChange: (date: Date) => void;
    accessibilityLabel: string;
}

interface State {
    showModal: boolean,
    modalDateTime: Date,
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "stretch",
        borderColor: "grey",
        borderWidth: 1,
    },
    text: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    date: {
        flex: 2,
        justifyContent: "center",
        alignItems: "stretch",
    },
});

export default class DateTimeInput extends React.Component<Props,State> {
    modalInput: React.RefObject<ModalInput>

    constructor(props: Props) {
        super(props);

        this.state = {
            showModal: false,
            modalDateTime: this.props.value,
        }

        this.modalInput = React.createRef();
    }

    onChange = (date: Date) => {
        this.setState({
            modalDateTime: date
        })
    }

    saveInput = () => {
        if(this.modalInput.current) {
            this.modalInput.current.hideModal(); 
        }
        this.props.onValueChange(this.state.modalDateTime);
    }

    renderDateTime = (date: Date) => {
        const dateStr = date.toDateString();
        const timeStr = date.toTimeString().split(" ")[0];

        if(this.props.type === "date") {
            return dateStr;
        }

        if(this.props.type === "time") {
            return timeStr;
        }

        return dateStr + " at " + timeStr;
    }

    render = () => {
        return (
            <ModalInput
                title={this.props.title}
                animationType={"fade"}
                screenType={"grey"}
                value={this.renderDateTime(this.props.value)}
                ref={this.modalInput}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                <View style={[Style.modalContainer, { backgroundColor: "white"}]}>
                    <DateTimePicker
                        onChange={this.onChange}
                        dateTime={this.props.value}
                        type={this.props.type}
                    >
                    </DateTimePicker>
                    <Button
                        title="Save"
                        onPress={this.saveInput}
                    >
                    </Button>
                </View>

            </ModalInput>
        );
    }
}
/*
        return (
            <View style={[localStyle.container, Style.maxInputHeight]}>
                <View style={[localStyle.text]}>
                    <Text>{this.props.title}</Text>
                </View>
                <View style={[localStyle.date]}>
                    <DateTimePicker></DateTimePicker>
                </View>
            </View>
        );
        */