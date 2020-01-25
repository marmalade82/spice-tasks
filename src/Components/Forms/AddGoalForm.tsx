import React from "react";
import DataComponent from "src/Components/base/DataComponent";

import { Text, TextInput, View, Picker } from "react-native";
import {
    ChoiceInput,
    StringInput,
    createSaveModalInput,
    ModalInput,
    DateTimeInput,
    MultipleInput,
    NumberInput,
} from "src/Components/Inputs";
import { RecurringForm, RecurringData, RecurringDefault} from "src/Components/Forms/RecurringForm";
import { StreakForm, StreakDefault, StreakData }from "src/Components/Forms/AddGoalForm/StreakForm";
import Style from "src/Style/Style";
import { ColumnView } from "../Basic/Basic";
import { RewardChoices, RewardType, Rewards } from "src/Models/Reward/RewardLogic";
import { GoalChoices, GoalType } from "src/Models/Goal/GoalLogic";

interface Props {
    navigation: Navigator
    onDataChange: (d: State) => void;
    data: State | false;
}

interface State {
    title: string;
    type: GoalType;
    recurring: boolean;
    start_date: Date;
    due_date: Date;
    reward: RewardType;
    penalty: Penalty
    recurData: RecurringData
    streakData: StreakData
}

interface Navigator {
    navigate: (screen: string) => void
}


enum Penalty {
    NONE = 1,
    DICE,
    ONE,
}

interface LabelValue {
    label: string,
    value: string,
    key: string

}


const penalties: LabelValue[] = [
    { label: "none", value: Penalty.NONE.toString(), key: Penalty.NONE.toString() },
    { label: "dice", value: Penalty.DICE.toString(), key: Penalty.DICE.toString() },
    { label: "Choose one...", value: Penalty.ONE.toString(), key: Penalty.ONE.toString() },
].sort((a, b) => {
    return parseInt(a.value) - parseInt(b.value);
});

function Default(): State {
    return {
        title: "",
        type: GoalType.NORMAL,
        recurring: false,
        start_date: new Date(),
        due_date: new Date(),
        reward: Rewards.NONE,
        penalty: Penalty.NONE,
        recurData: RecurringDefault(),
        streakData: StreakDefault(),
    } as const
}

export default class AddGoalForm extends DataComponent<Props, State, State> {
    RecurModalForm = createSaveModalInput(RecurringForm, RecurringDefault());
    constructor(props: Props) {
        super(props);

        this.state = Default();
    }

    onChangeTitle = (text: string) => {
        this.setData({
            title: text
        })
    }

    onRecurSave = (data: RecurringData) => {
        this.setData({
            recurData: data,
        });
    }

    onChangeStreak = (data: StreakData ) => {
        this.setData({
            streakData: data
        });
    }

    onChangeStartDate = (date: Date) => {
        this.setData({
            start_date: date
        });
    }

    onChangeDueDate = (date: Date) => {
        this.setData({
            due_date: date
        });
    }

    onChangeType = (type: string) => {
        if(type === GoalType.NORMAL || type === GoalType.STREAK) {
            this.setData({
                type: type
            });
        } else {
            this.setData({
                type: GoalType.NORMAL
            });
        }
    }

    onChangeMinimum = (type: number) => {

    }


    render = () => {
        return (
            <ColumnView style={[Style.blueBg]}>
                <StringInput
                    title={"Summary"}
                    value={this.data().title}
                    placeholder={"What do you want to achieve?"}
                    onChangeText={this.onChangeTitle}
                    accessibilityLabel={"goal-summary"}
                />

                <ChoiceInput
                    title={"Type"}
                    selectedValue={this.data().type}
                    choices={GoalChoices}
                    onValueChange={this.onChangeType}
                    accessibilityLabel={"goal-type"}
                />

                { this.renderStreakForm() }

                <DateTimeInput
                    title={"Starts on"}
                    type={"date"}
                    value={ this.data().start_date }
                    onValueChange={ this.onChangeStartDate }
                    accessibilityLabel={ "goal-start-date" }
                />

                <DateTimeInput
                    title={"Due on"} 
                    type={"date"}
                    value={ this.data().due_date }
                    onValueChange={ this.onChangeDueDate }
                    accessibilityLabel = { "goal-due-date" }
                />

                <ChoiceInput
                    title={"Reward"}
                    selectedValue={this.data().reward.toString()}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setData({reward: itemValue as RewardType})  
                    }}
                    choices={RewardChoices}
                    accessibilityLabel={"goal-reward"}
                />

                <ChoiceInput
                    title={"Penalty"}
                    selectedValue={this.data().penalty.toString()}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setData({penalty: parseInt(itemValue)})  
                    }}
                    choices={penalties}
                    accessibilityLabel={"goal-penalty"}
                />

                <this.RecurModalForm
                    title={"Recurring?"} 
                    animationType={"fade"}
                    screenType={"grey"}
                    onSave={this.onRecurSave}
                    formProps={{
                        data: false,
                        onDataChange: () => {} // this is overwritten
                    }}
                    renderData={(d: RecurringData) => {
                        return "hi there, please impement data renderer";
                    }}
                    accessibilityLabel={"goal-recurring"}
                />
            </ColumnView>
        )
    }

    renderStreakForm = () => {
        if(this.data().type === "streak") {
            return (
                <StreakForm
                    data={this.data().streakData}
                    onDataChange={this.onChangeStreak}
                    containerStyle={{
                        flex: 3
                    }}
                />
            );
        } else {
        }
    };

    renderChoices = (choices: LabelValue[]) => {
        return choices.map((choice: LabelValue) => {
            return (
                <Picker.Item label={choice.label} value={choice.value}/>
            );
        })
    }

    renderRecurData = () => {
        return this.data().recurData.recurs + " " + this.data().recurData.date.toDateString();
    }
}

export {
    AddGoalForm,
    Default as AddGoalDefault,
    State as AddGoalData,
}