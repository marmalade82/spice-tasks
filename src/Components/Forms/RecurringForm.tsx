import React from "react";
import { Text, View, Button, } from "react-native";
import Style from "src/Style/Style";
import { ChoiceInput, DateTimeInput, MultipleInput } from "src/Components/Inputs";
import DataComponent from "src/Components/base/DataComponent";

interface Props {
    data: Data | false
    onDataChange: (data: Data) => void;
}

interface State extends Data {
}

interface Data {
    recurs: string;
    date: Date;
    time: Date;
    weeks: number
    days_of_week: string[]; // bitmap of first 7 bits in a number.
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


const weekChoices = [
    { label: "M"
    , value: "monday"
    , key: "0"
    },
    { label: "T"
    , value: "tuesday"
    , key: "1"
    },
    { label: "W"
    , value: "wednesday"
    , key: "2"
    },
    { label: "R"
    , value: "thursday"
    , key: "3"
    },
    { label: "F"
    , value: "friday"
    , key: "4"
    },
    { label: "S"
    , value: "saturday"
    , key: "5"
    },
    { label: "Su"
    , value: "sunday"
    , key: "6"
    },
]

const Default = {
    recurs: "never",
    date: new Date(),
    time: new Date(),
    weeks: 1,
    days_of_week: ["sunday"],
    months: 1,
    days_of_month: 0,
}

export default class RecurringForm extends DataComponent<Props, State, Data> {
    constructor(props: Props) {
        super(props);

        this.state = Default;
    }

    onRepeatChange = (value: string) => {
        this.setData({
            recurs: value
        });
    }

    onDateChange = (date: Date) => {
        this.setData({
            date: date
        });

    }

    onTimeChange = (time: Date) => {
        this.setData({
            time: time
        })
    }

    onChangeDaysOfWeek = (values: string[]) => {
        this.setData({
            days_of_week: values
        });
    }

    render = () => {
        return (
            <View style={[Style.container, {justifyContent: "flex-start"}]}>
                <ChoiceInput
                    title={"Repeats"}
                    choices={recur_types}
                    selectedValue={ this.data().recurs}
                    onValueChange={ this.onRepeatChange }
                >
                </ChoiceInput>

                {this.renderIfNever()}
                {this.renderIfOnce()}
                {this.renderIfDaily()}
                {this.renderIfWeekly()}
            </View>
        )
    }

    renderIfNever = () => {
        if(this.data().recurs === "never") {
        }
    }

    renderIfOnce = () => {
        if(this.data().recurs === "once") {
            return (
                <DateTimeInput
                    title={"When?"}
                    type={"date"}
                    onValueChange={this.onDateChange}
                    value={this.data().date}
                >
                </DateTimeInput>
            );
        }
    }

    renderIfDaily = () => {
        if(this.data().recurs === "daily") {
            return (
                <DateTimeInput
                    title={"When?"}
                    type={"time"}
                    onValueChange={this.onTimeChange}
                    value={this.data().time}
                >

                </DateTimeInput>
            );
        }
    }

    renderIfWeekly = () => {
        if(this.data().recurs === "weekly") {
            return (
                <MultipleInput
                    title={"Days of Week"}
                    choices={weekChoices}
                    values={this.data().days_of_week}
                    onValueChange={this.onChangeDaysOfWeek}
                />
            );
        }
    }
}


export {
    RecurringForm,
    Data as RecurringData,
    Default as RecurringDefault,
}