import React from "react";
import { View } from "react-native";
import { NumberInput, ChoiceInput, DateTimeInput } from "../../inputs/Inputs";
import { number } from "prop-types";

interface Props {

}

interface State extends Data {
}

interface Data {
    minimum: number
    type: "daily" | "weekly" | "monthly"
    daily_start: Date
    weekly_start: number
    monthly_start: number
}

export default class StreakForm extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
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

    onChangeWeeklyStart = (val: string) => {
        this.setState({
            weekly_start: 0
        });
    }

    onChangeMonthlyStart = (val: number) => {
        this.setState({
            monthly_start: val
        });
    }

    render = () => {
        return (
            <View>
                <NumberInput
                    title={"Minimum"}
                    value={0}
                    type={"integer"}
                    minimum={0}
                    precision={0}
                    onValueChange={this.onChangeMinimum}
                />

                <ChoiceInput
                    title={"Streak Type"}
                    selectedValue={"daily"} 
                    choices={[]}
                    onValueChange={this.onChangeType}
                />

                <DateTimeInput
                    title={"Time"}
                    value={new Date()}
                    type={"time"}
                    onValueChange={this.onChangeDailyStart}
                />

                <ChoiceInput
                    title={"Week Start"}
                    selectedValue={"sunday"}
                    choices={[]} 
                    onValueChange={this.onChangeWeeklyStart}
                />

                <NumberInput
                    title={"Month Start"}
                    value={1}
                    type={"integer"}
                    minimum={1}
                    maximum={31}
                    onValueChange={this.onChangeMonthlyStart}
                />
            </View>

        );
    }
}