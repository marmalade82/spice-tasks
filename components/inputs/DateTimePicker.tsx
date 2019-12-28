import React from "react";
import { 
    View, Text, Platform, DatePickerIOS, 
    DatePickerAndroid, TimePickerAndroid, StyleSheet, Button 
} from "react-native";
import Style from "../../styles/Style";

interface Props {
    onChange: (dateTime: Date) => void
    dateTime: Date // initial date time
    type: "date" | "time" | "both"
}

interface State {
    date: Date,
    time: Date,
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

export default class DateTimePicker extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            date: this.props.dateTime,
            time: this.props.dateTime,
        }
    }

    onPress = async () => {
        if(Platform.OS === "android") {
            await this.onPressDateAndroid();
        }
    }

    onPressDateAndroid = async() => {
        const dateOpts = await DatePickerAndroid.open({
            date: new Date(),
            mode: 'default',
        });

        if(dateOpts.action === DatePickerAndroid.dateSetAction) {
            this.setState({
                date: new Date(dateOpts.year, dateOpts.month, dateOpts.day),
            });
            this.props.onChange(this.getDate())
        }
    }

    onPressTimeAndroid = async() => {
        const timeOpts = await TimePickerAndroid.open({
            hour: this.state.time.getHours(),
            minute: this.state.time.getMinutes(),
            is24Hour: true,
            mode: 'default',
        });

        if(timeOpts.action === TimePickerAndroid.timeSetAction) {
            let date = new Date();
            date.setHours(timeOpts.hour);
            date.setMinutes(timeOpts.minute);
            this.setState({
                time: date
            });
            this.props.onChange(this.getDate())
        }

    }

    getDate = () => {
        let date = new Date(this.state.date)
        date.setHours(this.state.time.getHours());
        date.setMinutes(this.state.time.getMinutes());
        return (
            date
        );
    }

    renderDatePicker = () => {
        if(this.props.type === "time") {
            return <View></View>;
        }

        return (
            <View style={[localStyle.container, Style.maxInputHeight]}>
                <View style={[localStyle.text, Style.yellowBg]}>
                    <Text>Date</Text>
                </View>
                <View style={[localStyle.date, Style.whiteBg]}>
                    <Text onPress={this.onPress}>{this.state.date.toDateString()}</Text>
                </View>
            </View>
        );
    }

    renderTimePicker = () => {
        if(this.props.type === "date") {
            return <View></View>;
        }

        return (
            <View style={[localStyle.container, Style.maxInputHeight]}>
                <View style={[localStyle.text, Style.yellowBg]}>
                    <Text>Time</Text>
                </View>
                <View style={[localStyle.date, Style.whiteBg]}>
                    <Text onPress={this.onPressTimeAndroid}>{this.state.time.toTimeString()}</Text>
                </View>
            </View>
        );
    }

    render = () => {
        return ( 
            <View style={[Style.container]}>
                { this.renderDatePicker() }
                { this.renderTimePicker() }
            </View>
        );
    }
}