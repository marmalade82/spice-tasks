import React from "react";
import { 
    View, StyleSheet, KeyboardAvoidingView
} from "react-native";
import { 
    NumberInput, ChoiceInput, DateTimeInput,
    MultipleInput
} from "src/Inputs";
import { number } from "prop-types";
import Style from "src/Style/Style";
import {
    StreakFormController,
    Data, Day,
} from "./StreakFormController";
import {
    ControllerInstance, Controller,
    Child
} from "../../../../controllers/Controller";

interface Props {
    registerChild?: (child: Child<Data>) => void
}

interface State extends Data {
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default class StreakForm extends React.Component<Props, State> {
    controller: ControllerInstance<Data>
    constructor(props: Props) {
        super(props);
        const initialState: State = {
            minimum: 2,
            type: "daily",
            daily_start: new Date(),
            weekly_start: "sunday",
            monthly_start: 1,
        }
        this.controller = new StreakFormController(initialState);
        this.controller.subscribe(this);
        if(this.props.registerChild) {
            this.props.registerChild(this.controller);
        }
        this.state = initialState;
    }


    onChangeMinimum = (val: number) => {
        this.controller.commit({
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
            this.controller.commit({
                type: val
            });
        } else {
            this.controller.commit({
                type: "daily"
            })
        }
    }

    onChangeDailyStart = (val: Date) => {
        this.controller.commit({
            daily_start: val
        });
    }

    onChangeWeeklyStart = (vals: string[]) => {
        if(vals.length > 0) {
            this.controller.commit({
                weekly_start: vals[vals.length - 1] as Day
            });
        } else {
            this.controller.commit({});
        }
    }

    onChangeMonthlyStart = (val: number) => {
        this.controller.commit({
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