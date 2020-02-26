import React from "react";
import DataComponent from "src/Components/base/DataComponent";
import { Choices as RecurTypeChoices } from "src/Models/Recurrence/RecurLogic";

import { Text, TextInput, View, Picker, ScrollView } from "react-native";
import {
    ChoiceInput,
    StringInput,
    createSaveModalInput,
    ModalInput,
    DateTimeInput,
    MultipleInput,
    NumberInput,
    DynamicChoiceInput,
} from "src/Components/Inputs";

import { Props as SummaryProps } from "src/Components/Inputs/StringInput";
import { RecurringForm, RecurringData, RecurringDefault} from "src/Components/Forms/RecurringForm";
import { StreakForm, StreakDefault, StreakData }from "src/Components/Forms/AddGoalForm/StreakForm";
import Style from "src/Style/Style";
import { ColumnView } from "../Basic/Basic";
import { RewardChoices, RewardType, Rewards } from "src/Models/Reward/RewardLogic";
import { GoalChoices, GoalType } from "src/Models/Goal/GoalLogic";
import { Validate } from "src/Components/Inputs/Validate";
import { Observable } from "rxjs";
import { PenaltyTypes, PenaltyChoices } from "src/Models/Penalty/PenaltyLogic";

interface Props {
    navigation: Navigator
    onDataChange: (d: State) => void;
    rewardChoices: Observable<LabelValue[]>
    data: State | false;
}

interface State {
    title: string;
    details: string;
    type: GoalType;
    start_date: Date;
    due_date: Date;
    reward: RewardType;
    rewardId: string;
    penalty: PenaltyTypes;
    repeats: "never" | "daily" | "weekly" | "monthly"
    //recurData: RecurringData
    streakData: StreakData
}

interface Navigator {
    navigate: (screen: string) => void
}


interface LabelValue {
    label: string,
    value: string,
    key: string

}


function Default(): State {
    return {
        title: "",
        type: GoalType.NORMAL,
        start_date: new Date(),
        due_date: new Date(),
        reward: Rewards.SPECIFIC,
        rewardId: "",
        penalty: PenaltyTypes.NONE,
        //recurData: RecurringDefault(),
        streakData: StreakDefault(),
        details: "",
        repeats: "never",
    } as const
}

export default class AddGoalForm extends DataComponent<Props, State, State> {
    SummaryInput = Validate<string, SummaryProps>(
                        StringInput, 
                        (d: string) => { return d.length > 0 },
                        (d: string) => { return d.length > 0},
                        (d: string) => "",
                        (d: string) => ""
                   )
    constructor(props: Props) {
        super(props);

        this.state = Default();
    }

    onChangeTitle = (text: string) => {
        this.setData({
            title: text
        })
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

    onChangeDetails = (dets: string) => {
        this.setData({
            details: dets
        })
    }

    render = () => {
        return (
            <ColumnView style={[{
                backgroundColor: "transparent",
            }]}>
                <ScrollView>
                    <ChoiceInput
                        title={"Type"}
                        selectedValue={this.data().type}
                        choices={GoalChoices}
                        onValueChange={this.onChangeType}
                        accessibilityLabel={"goal-type"}
                    />

                    <this.SummaryInput
                        title={"Summary"}
                        data={this.data().title}
                        placeholder={"What do you want to achieve?"}
                        onValidDataChange={this.onChangeTitle}
                        onInvalidDataChange={this.onChangeTitle}
                        accessibilityLabel={"goal-summary"}
                    >
                    </this.SummaryInput>

                    <StringInput
                        title={"Details"}
                        data={this.data().details}
                        placeholder={"Explain what this goal is all about"}
                        onDataChange={this.onChangeDetails}
                        accessibilityLabel={"goal-details"}
                        multiline={true}
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

                    { this.renderByRewardType() }



                    <ChoiceInput
                        title={"Penalty"}
                        selectedValue={this.data().penalty.toString()}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setData({penalty: itemValue as PenaltyTypes})  
                        }}
                        choices={PenaltyChoices}
                        accessibilityLabel={"goal-penalty"}
                    />

                    <ChoiceInput
                        title={"Repeats"}
                        selectedValue={this.data().repeats.toString()}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setData({
                                repeats: itemValue as "never" | "daily" | "weekly" | "monthly"
                            })
                        }}
                        choices={RecurTypeChoices}
                        accessibilityLabel={"goal-repeat"}
                    ></ChoiceInput>
                </ScrollView>
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

    renderByRewardType = () => {
        if(this.data().reward === Rewards.SPECIFIC) {
            return (
                <DynamicChoiceInput
                    title={"Specific Reward"}
                    selectedValue={this.data().rewardId}
                    onValueChange={(itemValue) => {
                        this.setData({
                            rewardId: itemValue
                        })
                    }}
                    choices={this.props.rewardChoices}
                    accessibilityLabel={"goal-specific-reward"}
                ></DynamicChoiceInput>
            );
        }
    }
}

export {
    AddGoalForm,
    Default as AddGoalDefault,
    State as AddGoalData,
}