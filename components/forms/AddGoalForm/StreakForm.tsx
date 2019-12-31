import React from "react";
import { 
    View, StyleSheet, KeyboardAvoidingView
} from "react-native";
import { 
    NumberInput, ChoiceInput, DateTimeInput,
    MultipleInput
} from "../../inputs/Inputs";
import { number } from "prop-types";
import Style from "../../../styles/Style";

interface Props {

}

interface State extends Data {
}

type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
type WeekEnd = "sunday" | "saturday";
type Day = WeekDay | WeekEnd;

interface Data {
    minimum: number
    type: "daily" | "weekly" | "monthly"
    daily_start: Date
    weekly_start: Day
    monthly_start: number
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default class StreakForm extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            minimum: 2,
            type: "daily",
            daily_start: new Date(),
            weekly_start: "sunday",
            monthly_start: 1,
        }
    }

    onChangeMinimum = (val: number) => {
        this.setState({
            minimum: val
        });
    }

    data: () => Data = () => {
        return {
            minimum: this.state.minimum,
            type: this.state.type,
            daily_start: this.state.daily_start,
            weekly_start: this.state.weekly_start,
            monthly_start: this.state.monthly_start,

        };
    }

    onChangeType = (val: string) => {
        if(val === "daily" || val === "weekly" || val === "monthly") {
            this.setState({
                type: val
            });
        } else {
            this.setState({
                type: "daily"
            })
        }

    }

    onChangeDailyStart = (val: Date) => {
        this.setState({
            daily_start: val
        })
    }

    onChangeWeeklyStart = (vals: string[]) => {
        if(vals.length > 0) {
            this.setState({
                weekly_start: vals[vals.length - 1] as Day
            });
        } else {
            // Otherwise no change
        }
    }

    onChangeMonthlyStart = (val: number) => {
        this.setState({
            monthly_start: val
        });
    }

    renderByType = () => {
        if(this.state.type === "daily") {
            return (
                <DateTimeInput
                    title={"Time"}
                    value={this.state.daily_start}
                    type={"time"}
                    onValueChange={this.onChangeDailyStart}
                />
            );
        } else if (this.state.type === "weekly") {
            return (
                <MultipleInput
                    title={"Week Start"}
                    values={[this.state.weekly_start]}
                    choices={week_start_choices} 
                    onValueChange={this.onChangeWeeklyStart}
                />
            );

        } else if (this.state.type === "monthly") {
            return (
                <NumberInput
                    title={"Month Start"}
                    value={this.state.monthly_start}
                    type={"integer"}
                    minimum={1}
                    maximum={31}
                    onValueChange={this.onChangeMonthlyStart}
                />
            );
        } else {

        }
    }

    render = () => {
        return (
            <KeyboardAvoidingView 
                style={[Style.container, localStyle.container, Style.greenBg]}
                behavior={"padding"}
            >
                <NumberInput
                    title={"Minimum"}
                    value={this.state.minimum}
                    type={"integer"}
                    minimum={2}
                    precision={0}
                    onValueChange={this.onChangeMinimum}
                />
                <ChoiceInput
                    title={"Streak Type"}
                    selectedValue={this.state.type} 
                    choices={streak_choices}
                    onValueChange={this.onChangeType}
                />

                {this.renderByType()}
            </KeyboardAvoidingView>

        );
    }
}

const streak_choices = [
    {   label: "Daily",
        value: "daily",
        key: "0"
    }, 
    { label: "Weekly"
    , value: "weekly"
    , key: "1"
    },
    { label: "Monthly"
    , value: "monthly"
    , key: "2"
    }
];

const week_start_choices = [
    { label: "Su"
    , value: "sunday"
    , key: "0"
    },
    { label: "Mo"
    , value: "monday"
    , key: "1"
    },
    { label: "Tu"
    , value: "tuesday"
    , key: "2"
    },
    { label: "We"
    , value: "wednesday"
    , key: "3"
    },
    { label: "Th"
    , value: "thursday"
    , key: "4"
    },
    { label: "Fr"
    , value: "friday"
    , key: "5"
    },
    { label: "Sa"
    , value: "saturday"
    , key: "6"
    },
];