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
}

interface State {
    dateTime: Date,
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
            dateTime: this.props.value,
            showModal: false,
            modalDateTime: new Date(),
        }

        this.modalInput = React.createRef();
    }

    onChange = (date: Date) => {
        this.setState({
            modalDateTime: date
        })
    }

    saveInput = () => {
        this.setState({
            dateTime: this.state.modalDateTime
        });

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
                value={this.renderDateTime(this.state.dateTime)}
                ref={this.modalInput}
            >
                <View style={[Style.modalContainer, { backgroundColor: "white"}]}>
                    <DateTimePicker
                        onChange={this.onChange}
                        dateTime={this.state.dateTime}
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