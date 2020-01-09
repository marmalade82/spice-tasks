import React from "react";
import { 
    View, StyleSheet, KeyboardAvoidingView, StyleProp, ViewStyle
} from "react-native";
import { 
    NumberInput, ChoiceInput, DateTimeInput,
    MultipleInput
} from "src/Components/Inputs";
import DataComponent from "src/Components/base/DataComponent";
import Style from "src/Style/Style";
import { DayOfWeek } from "lib/recurrence";

interface Props {
    data: State | false
    onDataChange: (d: State) => void;
    containerStyle?: StyleProp<ViewStyle>;
}

interface State {
    minimum: number,
    type: "daily" | "weekly" | "monthly"
    daily_start: Date,
    weekly_start: string,
    monthly_start: number,
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
    }
})

const Default: State = {
    minimum: 2,
    type: "daily",
    daily_start: new Date(),
    weekly_start: "sunday",
    monthly_start: 1,
}

export default class StreakForm extends DataComponent<Props, State, State> {
    constructor(props: Props) {
        super(props);

        this.state = Default;
    }


    onChangeMinimum = (val: number) => {
        this.setData({
            minimum: val
        });
    }

    onChangeType = (val: string) => {
        if(val === "daily" || val === "weekly" || val === "monthly") {
            this.setData({
                type: val
            });
        } else {
            this.setData({
                type: "daily"
            })
        }
    }

    onChangeDailyStart = (val: Date) => {
        this.setData({
            daily_start: val
        });
    }

    onChangeWeeklyStart = (vals: string[]) => {
        if(vals.length > 0) {
            this.setData({
                weekly_start: vals[vals.length - 1]
            });
        } else {
            this.setData({});
        }
    }

    onChangeMonthlyStart = (val: number) => {
        this.setData({
            monthly_start: val
        });
    }

    render = () => {
        return (
            <KeyboardAvoidingView 
                style={[Style.container, localStyle.container, Style.greenBg, this.props.containerStyle]}
                behavior={"padding"}
            >
                <NumberInput
                    title={"Minimum"}
                    value={this.data().minimum}
                    type={"integer"}
                    minimum={2}
                    precision={0}
                    onValueChange={this.onChangeMinimum}
                />
                <ChoiceInput
                    title={"Streak Type"}
                    selectedValue={this.data().type} 
                    choices={streak_choices}
                    onValueChange={this.onChangeType}
                />

                {this.renderByType()}
            </KeyboardAvoidingView>

        );
    }

    renderByType = () => {
        if(this.data().type === "daily") {
            return (
                <DateTimeInput
                    title={"Time"}
                    value={this.data().daily_start}
                    type={"time"}
                    onValueChange={this.onChangeDailyStart}
                />
            );
        } else if (this.data().type === "weekly") {
            return (
                <MultipleInput
                    title={"Week Start"}
                    values={[this.data().weekly_start]}
                    choices={week_start_choices} 
                    onValueChange={this.onChangeWeeklyStart}
                />
            );

        } else if (this.data().type === "monthly") {
            return (
                <NumberInput
                    title={"Month Start"}
                    value={this.data().monthly_start}
                    type={"integer"}
                    minimum={1}
                    maximum={31}
                    onValueChange={this.onChangeMonthlyStart}
                />
            );
        } else {

        }
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

export {
    StreakForm,
    State as StreakData,
    Default as StreakDefault,
}