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

import { Props as DynamicChoiceProps } from "src/Components/Inputs/DynamicChoiceInput";

import { Props as SummaryProps } from "src/Components/Inputs/StringInput";
import { Props as DateProps } from "src/Components/inputs/DateTimeInput";
import { StreakForm, StreakDefault, StreakData }from "src/Components/Forms/AddGoalForm/StreakForm";
import { ColumnView } from "../Basic/Basic";
import { RewardChoices, RewardType, RewardTypes } from "src/Models/Reward/RewardLogic";
import { GoalChoices, GoalType } from "src/Models/Goal/GoalLogic";
import { Validate } from "src/Components/Inputs/Validate";
import { Observable, merge } from "rxjs";
import { mapTo } from "rxjs/operators";
import { PenaltyTypes, PenaltyChoices } from "src/Models/Penalty/PenaltyLogic";
import { EventDispatcher, IEventDispatcher, fromEvent } from "src/common/EventDispatcher";
import { ROW_CONTAINER_HEIGHT, CONTAINER_VERTICAL_MARGIN } from "../Styled/Styles";
import FootSpacer from "../Basic/FootSpacer";
import { startDate, dueDate } from "./common/utils";
import { FullNavigation } from "src/common/Navigator";
import MyDate from "src/common/Date";

interface Props {
    navigation: FullNavigation
    onDataChange: (d: State) => void;
    rewardChoices: Observable<LabelValue[]>
    penaltyChoices: Observable<LabelValue[]>
    data: State | false;
    formType?: "create" | "update";
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
    streakData: StreakData;
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
        start_date: startDate(MyDate.Now().toDate()),
        due_date: dueDate(MyDate.Now().toDate()),
        reward: RewardTypes.NONE,
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

    const specificRewardMessage = form.validateSpecificReward(state.rewardId);
    if(specificRewardMessage !== undefined) {
        return specificRewardMessage;
    }

    const specificPenaltyMessage = form.validateSpecificPenalty(state.penaltyId);
    if(specificPenaltyMessage !== undefined) {
        return specificPenaltyMessage;
    }

    return undefined;
};

const DUE_DATE_CHANGE = 'due_date_change';
const START_DATE_CHANGE = 'start_date_change';
const EXTERNAL_CHANGE = 'external_change';

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
    SpecificRewardInput = Validate<string, DynamicChoiceProps>(
                            DynamicChoiceInput,
                            (s: string) => this.validateSpecificReward(s),
                            (s: string) => this.validateSpecificReward(s),
                        );
    SpecificPenaltyInput = Validate<string, DynamicChoiceProps> (
                            DynamicChoiceInput,
                            (s: string) => this.validateSpecificPenalty(s),
                            (s: string) => this.validateSpecificPenalty(s),
                            )
    dispatcher: IEventDispatcher;
    startDateRefresh : Observable<boolean>;

    constructor(props: Props) {
        super(props);

        this.state = Default();
        this.dispatcher = new EventDispatcher();

        const startDateChange: Observable<boolean> = fromEvent(this.dispatcher, DUE_DATE_CHANGE).pipe(mapTo(true));
        this.startDateRefresh = startDateChange
    }
    
    /*******************************************
     * Validation functions
     */
    refreshValidation = () => {
        this.dispatcher.fireEvent(EXTERNAL_CHANGE);
    }

    validateTitle = (title: string) => {
        return title.length > 0 ? undefined : "Please provide a summary";
    }

    validateStartDate = (start: Date) => {
        return start > this.data().due_date ? "Start date cannot be after due date" : undefined
    }

    validateSpecificReward = (rewardId: string) => {
        switch(this.data().reward) {
            case RewardTypes.SPECIFIC: {
                return rewardId.length > 0 ? undefined : "Please choose a reward";
            } break;
            default : {
                return undefined;
            }
        }
    }

    validateSpecificPenalty = (penaltyId: string) => {
        switch(this.data().penalty) {
            case PenaltyTypes.SPECIFIC: {
                return penaltyId.length > 0 ? undefined : "Please choose a penalty";
            } break;
            default: {
                return undefined;
            }
        }
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
            start_date: startDate(date)
        });

        this.dispatcher.fireEvent(START_DATE_CHANGE);
    }

    onChangeDueDate = (date: Date) => {
        this.setData({
            due_date: dueDate(date),
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

    onChangeSpecificReward = (rewardId: string) => {
        this.setData({
            rewardId: rewardId,
        })
    }

    onChangeSpecificPenalty = (penaltyId: string) => {
        this.setData({
            penaltyId: penaltyId
        })
    }

    /********************************************************************
     * Render functions
     */

    render = () => {
        const SummaryInput = this.SummaryInput;
        const StartDateInput = this.StartDateInput;

        return (
            <ColumnView style={[{
                backgroundColor: "transparent",
            }]}>
                <ScrollView>

                    <SummaryInput
                        style={{
                            marginTop: CONTAINER_VERTICAL_MARGIN,
                        }}
                        title={"Summary"}
                        data={this.data().title}
                        placeholder={"What do you want to achieve?"}
                        onValidDataChange={this.onChangeTitle}
                        onInvalidDataChange={this.onChangeTitle}
                        accessibilityLabel={"goal-summary"}
                    >
                    </SummaryInput>

                    <StringInput
                        title={"Details"}
                        data={this.data().details}
                        placeholder={"Explain what this goal is all about"}
                        onDataChange={this.onChangeDetails}
                        accessibilityLabel={"goal-details"}
                        multiline={true}
                    />


                    <ChoiceInput
                        title={"Goal Type"}
                        selectedValue={this.data().type}
                        choices={GoalChoices}
                        onValueChange={this.onChangeType}
                        accessibilityLabel={"goal-type"}
                    />
                    { this.renderStreakForm() }

                    <StartDateInput
                        title={"Starts on"}
                        type={"date"}
                        data={ this.data().start_date }
                        onValidDataChange={ this.onChangeStartDate }
                        onInvalidDataChange={ this.onChangeStartDate }
                        accessibilityLabel={ "goal-start-date" }
                        revalidate={this.startDateRefresh}
                    ></StartDateInput>

                    <DateTimeInput
                        title={"Due on"} 
                        type={"date"}
                        data={ this.data().due_date }
                        onDataChange={ this.onChangeDueDate }
                        accessibilityLabel = { "goal-due-date" }
                    ></DateTimeInput>

                    { this.renderRepeats() }

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
                    
                    <FootSpacer></FootSpacer>
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
        if(this.data().reward === RewardTypes.SPECIFIC) {
            const SpecificRewardInput = this.SpecificRewardInput;
            return (
                <SpecificRewardInput
                    title={"Specific Reward"}
                    data={this.data().rewardId}
                    onValidDataChange={this.onChangeSpecificReward}
                    onInvalidDataChange={this.onChangeSpecificReward}
                    choices={this.props.rewardChoices}
                    accessibilityLabel={"goal-specific-reward"}
                    emptyType={"earned-reward"}
                    onEmptyPress={() => {
                        this.props.navigation.navigate("AddReward", {
                            id: "",
                            parent_id: "",
                        })
                    }}
                ></SpecificRewardInput>
            );
        }
    }

    renderByPenaltyType = () => {
        if(this.data().penalty === PenaltyTypes.SPECIFIC) {
            const SpecificPenaltyInput = this.SpecificPenaltyInput;
            return (
                <SpecificPenaltyInput
                    title={"Specific Penalty"}
                    data={this.data().penaltyId}
                    onValidDataChange={this.onChangeSpecificPenalty}
                    onInvalidDataChange={this.onChangeSpecificPenalty}
                    choices={this.props.penaltyChoices}
                    accessibilityLabel={"goal-specific-penalty"}
                    emptyType={"earned-penalty"}
                    onEmptyPress={() => {
                        this.props.navigation.navigate("AddPenalty", {
                            id: "",
                            parent_id: "",
                        })
                    }}
                ></SpecificPenaltyInput>
            )
        }
    }

    renderRepeats = () => {
        if(this.props.formType !== "update") {
            return (
                    <ChoiceInput
                        title={"Goal Will Repeat"}
                        selectedValue={this.data().repeats.toString()}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setData({
                                repeats: itemValue as "never" | "daily" | "weekly" | "monthly"
                            })
                        }}
                        choices={RecurTypeChoices}
                        accessibilityLabel={"goal-repeat"}
                    ></ChoiceInput>
            );
        }

        return null;
    }
}

export {
    AddGoalForm,
    Default as AddGoalDefault,
    State as AddGoalData,
}