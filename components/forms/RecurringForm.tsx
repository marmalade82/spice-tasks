import React from "react";
import { Text, View, Button, } from "react-native";
import Style from "../../styles/Style";
import { ChoiceInput, DateTimeInput, MultipleInput } from "../inputs/Inputs";

interface Props {
    onDataChange?: (data: Data) => void;
    data?: Data
    onSave: (data: Data) => void;
}

interface State {
    recurs: string;
    date: Date;
    time: Date;
    weeks: number
    days_of_week: number; // bitmap of first 7 bits in a number.
    months: number;
    days_of_month: number; // bitmap of first 12 bits in a number
}

const recur_types = [
    { label: "Never"
    , value: "never"
    , key: "0"
    }, 
    { label: "Once"
    , value: "once"
    , key: "1"
    },
    { label: "Daily"
    , value: "daily"
    , key: "2"
    },
    { label: "Weekly"
    , value: "weekly"
    , key: "3"
    },
    { label: "Monthly"
    , value: "monthly"
    , key: "4"
    }
];

interface Data {
    recurs: string;
    date: Date;
}

export default class RecurringForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            recurs: this.props.data.recurs ? this.props.data.recurs : "never",
            date: this.props.data.date ? this.props.data.date : new Date(),
            time: new Date(),
            weeks: 1,
            days_of_week: 0,
            months: 1,
            days_of_month: 0,
        }
    }

    data: () => Data = () => {
        return {
            recurs: this.state.recurs,
            date: this.state.date,
        }
    }

    onRepeatChange = (value: string) => {
        this.setState({
            recurs: value
        });

        this.dataChanged();
    }

    onDateChange = (date: Date) => {
        this.setState({
            date: date
        });

        this.dataChanged();
    }

    onTimeChange = (time: Date) => {
        this.setState({
            time: time
        })

        this.dataChanged();
    }

    dataChanged = () => {
        if(this.props.onDataChange) {
            this.props.onDataChange(this.data());
        }
    }

    render = () => {
        return (
            <View style={[Style.container, {justifyContent: "flex-start"}]}>
                <ChoiceInput
                    title={"Repeats"}
                    choices={recur_types}
                    selectedValue={this.state.recurs}
                    onValueChange={ this.onRepeatChange }
                >
                </ChoiceInput>

                {this.renderIfNever()}
                {this.renderIfOnce()}
                {this.renderIfDaily()}
                <DateTimeInput
                    title={"When?"}
                    type={"date"}
                    onValueChange={this.onDateChange}
                    value={this.state.date}
                >
                </DateTimeInput>
                <Button title="Save"
                    onPress={() => {this.props.onSave(this.data())}}
                >
                </Button>
            </View>
        )
    }

    renderIfNever = () => {
        if(this.state.recurs === "never") {
            return (
                <View></View>
            );
        }
    }

    renderIfOnce = () => {
        if(this.state.recurs === "once") {
            return (
                <DateTimeInput
                    title={"When?"}
                    type={"date"}
                    onValueChange={this.onDateChange}
                    value={this.state.date}
                >
                </DateTimeInput>
            );
        }
    }

    renderIfDaily = () => {
        if(this.state.recurs === "daily") {
            return (
                <DateTimeInput
                    title={"When?"}
                    type={"time"}
                    onValueChange={this.onTimeChange}
                    value={this.state.time}
                >

                </DateTimeInput>
            );
        }
    }

    renderIfWeekly = () => {
        if(this.state.recurs === "weekly") {
            return (
                <MultipleInput
                    title={"Days of Week"}
                    choices={[]}
                >

                </MultipleInput>
            );
        }
    }
}