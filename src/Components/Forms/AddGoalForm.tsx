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

interface Props {
    navigation: Navigator
    onDataChange: (d: State) => void;
}

interface State {
    title: string;
    type: "normal" | "streak";
    recurring: boolean;
    start_date: Date;
    due_date: Date;
    reward: Reward
    penalty: Penalty
    recurData: RecurringData
    streakData: StreakData
}

interface Navigator {
    navigate: (screen: string) => void
}

enum Reward {
    NONE = 1,
    DICE,
    ONE,
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

const rewards: LabelValue[] = [
    { label: "none", value: Reward.NONE.toString(), key: Reward.NONE.toString() },
    { label: "dice", value: Reward.DICE.toString(), key: Reward.DICE.toString()},
    { label: "choose one...", value: Reward.ONE.toString(), key: Reward.ONE.toString() },
].sort((a, b) => {
    return parseInt(a.value) - parseInt(b.value)
});

const penalties: LabelValue[] = [
    { label: "none", value: Penalty.NONE.toString(), key: Penalty.NONE.toString() },
    { label: "dice", value: Penalty.DICE.toString(), key: Penalty.DICE.toString() },
    { label: "Choose one...", value: Penalty.ONE.toString(), key: Penalty.ONE.toString() },
].sort((a, b) => {
    return parseInt(a.value) - parseInt(b.value);
});

const Default: State = {
    title: "",
    type: "normal",
    recurring: false,
    start_date: new Date(),
    due_date: new Date(),
    reward: Reward.DICE,
    penalty: Penalty.NONE,
    recurData: RecurringDefault,
    streakData: StreakDefault,
}

export default class AddGoalForm extends DataComponent<Props, State, State> {
    RecurModalForm = createSaveModalInput(RecurringForm, RecurringDefault);
    constructor(props: Props) {
        super(props);

        this.state = Default;
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
        if(type === "streak" || type === "normal") {
            this.setData({
                type: type
            });
        } else {
            this.setData({
                type: "normal"
            });
        }
    }

    onChangeMinimum = (type: number) => {

    }


    render = () => {
        return (
            <View style={[Style.container, Style.blueBg]}>
                <StringInput
                    title={"Summary"}
                    value={this.data().title}
                    placeholder={"What do you want to achieve?"}
                    onChangeText={this.onChangeTitle}
                />

                <ChoiceInput
                    title={"Type"}
                    selectedValue={this.data().type}
                    choices={typeChoices}
                    onValueChange={this.onChangeType}
                />


                <DateTimeInput
                    title={"Starts on"}
                    type={"date"}
                    value={ this.data().start_date }
                    onValueChange={ this.onChangeStartDate }
                />

                <DateTimeInput
                    title={"Due on"} 
                    type={"date"}
                    value={ this.data().due_date }
                    onValueChange={ this.onChangeDueDate }
                />

                <ChoiceInput
                    title={"Reward"}
                    selectedValue={this.data().reward.toString()}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setData({reward: parseInt(itemValue)})  
                    }}
                    choices={rewards}
                />

                <ChoiceInput
                    title={"Penalty"}
                    selectedValue={this.data().penalty.toString()}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setData({penalty: parseInt(itemValue)})  
                    }}
                    choices={penalties}
                />

                <this.RecurModalForm
                    title={"Recurring?"} 
                    animationType={"fade"}
                    screenType={"grey"}
                    onSave={this.onRecurSave}
                    formProps={{
                        onDataChange: () => {} // this is overwritten
                    }}
                    renderData={(d: RecurringData) => {
                        return "hi there, please impement data renderer";
                    }}
                />
            </View>
        )
    }

    renderStreak = () => {
        if(this.data().type === "streak") {
            <StreakForm
                onDataChange={this.onChangeStreak}
            />
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



const typeChoices = [
    { label: "Normal"
    , value: "normal"
    , key: "1"
    },
    { label: "Streak"
    , value: "streak"
    , key: "0"
    },
]

export {
    AddGoalForm,
    Default as AddGoalDefault,
    State as AddGoalData,
}