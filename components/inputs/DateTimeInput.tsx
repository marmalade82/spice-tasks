import React from "react";
import { View, Text, StyleSheet, Modal, Button } from "react-native";

import DateTimePicker from "./DateTimePicker";
import ModalInput from "./ModalInput";
import Style from "../../styles/Style";

interface Props {
    title: string;
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
            dateTime: new Date(),
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
        this.modalInput.current.hideModal(); 
    }

    render = () => {
        return (
            <ModalInput
                title={"When?"}
                animationType={"fade"}
                screenType={"grey"}
                ref={this.modalInput}
            >
                <View style={[Style.modalContainer, { backgroundColor: "white"}]}>
                    <DateTimePicker
                        onChange={this.onChange}
                        dateTime={this.state.dateTime}
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