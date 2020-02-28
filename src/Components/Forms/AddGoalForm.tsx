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
import { Props as DateProps } from "src/Components/inputs/DateTimeInput";
import { RecurringForm, RecurringData, RecurringDefault} from "src/Components/Forms/RecurringForm";
import { StreakForm, StreakDefault, StreakData }from "src/Components/Forms/AddGoalForm/StreakForm";
import Style from "src/Style/Style";
import { ColumnView } from "../Basic/Basic";
import { RewardChoices, RewardType, Rewards } from "src/Models/Reward/RewardLogic";
import { GoalChoices, GoalType } from "src/Models/Goal/GoalLogic";
import { Validate } from "src/Components/Inputs/Validate";
import { Observable } from "rxjs";
import { mapTo } from "rxjs/operators";
import { PenaltyTypes, PenaltyChoices } from "src/Models/Penalty/PenaltyLogic";
import MyDate from "src/common/Date";
import { EventDispatcher, IEventDispatcher, fromEvent } from "src/common/EventDispatcher";
import { start } from "repl";

interface Props {
    navigation: Navigator
    onDataChange: (d: State) => void;
    rewardChoices: Observable<LabelValue[]>
    penaltyChoices: Observable<LabelValue[]>
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
    penaltyId: string;
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
        start_date: new MyDate().prevMidnight().toDate(),
        due_date: new MyDate().prevMidnight().toDate(),
        reward: Rewards.SPECIFIC,
        rewardId: "",
        penalty: PenaltyTypes.NONE,
        penaltyId: "",
        streakData: StreakDefault(),
        details: "",
        repeats: "never",
    } as const
}

export function ValidateGoalForm(form: AddGoalForm): string | undefined {
    const state = form.data();

    const titleMessage = form.validateTitle(state.title)
    if(titleMessage !== undefined) {
        return titleMessage;
    }

    const startDateMessage = form.validateStartDate(state.start_date);
    if(startDateMessage !== undefined) {
        return startDateMessage;
    }

    return undefined;
};

const DUE_DATE_CHANGE = 'due_date_change';
const START_DATE_CHANGE = 'start_date_change';

export default class AddGoalForm extends DataComponent<Props, State, State> {
    SummaryInput = Validate<string, SummaryProps>(
                        StringInput, 
                        (d: string) => this.validateTitle(d) ,
                        (d: string) => this.validateTitle(d),
                   )
    StartDateInput = Validate<Date, DateProps>(
                        DateTimeInput,
                        (d: Date) => this.validateStartDate(d) ,
                        (d: Date) => this.validateStartDate(d) ,
                    );
    dispatcher: IEventDispatcher;
    startDateRefresh : Observable<boolean>;
    dueDateRefresh : Observable<boolean>;

    constructor(props: Props) {
        super(props);

        this.state = Default();
        this.dispatcher = new EventDispatcher();
        this.startDateRefresh = fromEvent(this.dispatcher, DUE_DATE_CHANGE).pipe(mapTo(true));
        this.dueDateRefresh = fromEvent(this.dispatcher, START_DATE_CHANGE).pipe(mapTo(true)); 
    }
    
    /*******************************************
     * Validation functions
     */

    validateTitle = (title: string) => {
        return title.length > 0 ? undefined : "Please provide a summary";
    }

    validateStartDate = (start: Date) => {
        return start > this.data().due_date ? "Start date cannot be after end date" : undefined
    }

    /******************************************
     * Event handling functions
     */

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

        this.dispatcher.fireEvent(START_DATE_CHANGE);
    }

    onChangeDueDate = (date: Date) => {
        this.setData({
            due_date: date
        });

        // Put this lower so that setData goes on the event queue first.
        this.dispatcher.fireEvent(DUE_DATE_CHANGE);
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

    /********************************************************************
     * Render functions
     */

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

                    <this.StartDateInput
                        title={"Starts on"}
                        type={"date"}
                        data={ this.data().start_date }
                        onValidDataChange={ this.onChangeStartDate }
                        onInvalidDataChange={ this.onChangeStartDate }
                        accessibilityLabel={ "goal-start-date" }
                        revalidate={this.startDateRefresh}
                    ></this.StartDateInput>

                    <DateTimeInput
                        title={"Due on"} 
                        type={"date"}
                        data={ this.data().due_date }
                        onDataChange={ this.onChangeDueDate }
                        accessibilityLabel = { "goal-due-date" }
                    ></DateTimeInput>

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

                    { this.renderByPenaltyType() }

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

    renderByPenaltyType = () => {
        if(this.data().penalty === PenaltyTypes.SPECIFIC) {
            return (
                <DynamicChoiceInput
                    title={"Specific Penalty"}
                    selectedValue={this.data().penaltyId}
                    onValueChange={(itemValue) => {
                        this.setData({
                            penaltyId: itemValue
                        })
                    }}
                    choices={this.props.penaltyChoices}
                    accessibilityLabel={"goal-specific-penalty"}
                ></DynamicChoiceInput>
            )
        }
    }
}

export {
    AddGoalForm,
    Default as AddGoalDefault,
    State as AddGoalData,
}