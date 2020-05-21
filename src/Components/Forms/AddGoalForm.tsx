import React from "react";
import { Layout, Type } from "src/Components/Styled/StyleSheets";
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
import { Props as NumberInputProps } from "src/Components/inputs/NumberInput";
import { StreakForm, StreakDefault, StreakData, streak_choices }from "src/Components/Forms/AddGoalForm/StreakForm";
import { ColumnView } from "../Basic/Basic";
import { RewardChoices, RewardType, RewardTypes } from "src/Models/Reward/RewardLogic";
import { GoalChoices, GoalType } from "src/Models/Goal/GoalLogic";
import { Validate } from "src/Components/Inputs/Validate";
import { Observable, merge } from "rxjs";
import { mapTo } from "rxjs/operators";
import { PenaltyTypes, PenaltyChoices } from "src/Models/Penalty/PenaltyLogic";
import { EventDispatcher, IEventDispatcher, fromEvent } from "src/common/EventDispatcher";
import FootSpacer from "../Basic/FootSpacer";
import { startDate, dueDate } from "./common/utils";
import { FullNavigation } from "src/common/Navigator";
import MyDate from "src/common/Date";
import { makeForm, thread, required } from "./common/Form";
import { HideMap, ReadonlyMap, ValidationMap } from "@marmalade82/ts-react-forms";

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
    reward: RewardType;
    rewardId: string;
    penalty: PenaltyTypes;
    penaltyId: string;
    repeats: "never" | "daily" | "weekly" | "monthly"
    streakData: StreakData;
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
const EXTERNAL_CHANGE = 'external_change';

export default class AddGoalForm extends DataComponent<Props, State, State> {
    SummaryInput = Validate<string, SummaryProps>(
                        StringInput, 
                        (d: string) => this.validateTitle(d) ,
                        (d: string) => this.validateTitle(d),
                   )
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
    CycleInput = Validate<number, NumberInputProps>(
                            NumberInput,
                            (n: number) => this.validateCycleCount(n),
                            (n: number) => this.validateCycleCount(n),
                        );

    dispatcher: IEventDispatcher;

    constructor(props: Props) {
        super(props);

        this.state = Default();
        this.dispatcher = new EventDispatcher();
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

    validateCycleCount = (cycles: number) => {
        if(this.data().type === GoalType.STREAK) {
            return cycles < 1 ? "Number of cycles must be at least 1" : undefined
        }
        return undefined
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

    private onChangeTitle = (text: string) => {
        this.setData({
            title: text
        })
    }

    private onChangeStreak = (data: StreakData ) => {
        this.setData({
            streakData: data
        });
    }


    private onChangeDetails = (dets: string) => {
        this.setData({
            details: dets
        })
    }

    private onChangeSpecificReward = (rewardId: string) => {
        this.setData({
            rewardId: rewardId,
        })
    }

    private onChangeSpecificPenalty = (penaltyId: string) => {
        this.setData({
            penaltyId: penaltyId
        })
    }

    /********************************************************************
     * Render functions
     */

    render = () => {
        const SummaryInput = this.SummaryInput;

        return (
            <ColumnView style={[{
                backgroundColor: "transparent",
            }]}>
                <ScrollView>

                    <SummaryInput
                        style={Layout.ContainerMarginTop}
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

                    { this.renderIfStreakGoal() }

                    { this.renderIfNormalGoal() }

                    <ChoiceInput
                        title={"Reward"}
                        data={this.data().reward.toString()}
                        onDataChange={(itemValue, itemIndex) => {
                            this.setData({reward: itemValue as RewardType})  
                        }}
                        choices={RewardChoices}
                        accessibilityLabel={"goal-reward"}
                    />

                    { this.renderByRewardType() }


                    <ChoiceInput
                        title={"Penalty"}
                        data={this.data().penalty.toString()}
                        onDataChange={(itemValue, itemIndex) => {
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

    private renderIfStreakGoal = () => {
        if(this.data().type === "streak") {
            const CycleInput = this.CycleInput;
            return (
                <View
                    style={{
                        flex: 0
                    }}
                >
                    <StreakForm
                        data={this.data().streakData}
                        onDataChange={this.onChangeStreak}
                        containerStyle={{
                        }}
                    />
                </View>
            );
        }
        return null
    };


    private renderIfNormalGoal = () => {
        if(this.data().type === "normal") {
            return (
                <View
                    style={{
                        flex: 0
                    }}
                >
                </View>
            )
        }

        return null;
    }

    private renderByRewardType = () => {
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

    private renderByPenaltyType = () => {
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
}

export {
    AddGoalForm,
    Default as AddGoalDefault,
    State as AddGoalData,
}



export enum Mode {
    CREATE_HABIT,
    EDIT_HABIT,
    CREATE_GOAL,
    EDIT_GOAL,
}

export type FullData = {
    id: string,
    title: string,
    details: string
    streakType: "daily" | "weekly" | "monthly",
    repeatCount: number,
    rewardId: string,
    penaltyId: string,
}

const FullForm = makeForm<FullData>([
    { label: "ID", name: "id", type: "text"},
    { label: "Title", name: "title", type: "text" },
    { label: "Details", name: "details", type: "multi_text"},
    { label: "Repeat Total", name: "repeatCount", type: "number"},
    { label: "Type", name: "streakType", type: "choice"},
    { label: "Reward", name: "rewardId", type: "choice"},
    { label: "Penalty", name: "penaltyId", type: "choice"}
])

const FullLogic = {
    choices: {
        "streakType": streak_choices,
    }, 
    props: {
        title: {
            placeholder: "What do you want to achieve?"
        },
        details: {
            placeholder: "Explain what this goal is all about"
        }
    }

}

export const FullGoalForm = {
    Form: FullForm,
    Logic: FullLogic,
    validate: (mode: Mode) => GenValidate(mode),
    readonly: (mode: Mode) => GenReadonly(mode),
    hide: (mode: Mode) => GenHide(mode),
}

const GenValidate = (mode: Mode): ValidationMap<FullData> => {
    switch(mode) {
        case Mode.CREATE_GOAL: {
            return {
                title: async (data) => thread(data, required("title", "Title")) as any,
            }
        }
        case Mode.EDIT_GOAL: {

        }
        case Mode.CREATE_HABIT: {
            return {
                title: async (data) => thread(data, required("title", "Title")) as any,
                repeatCount: async (data) => {
                    if(data.repeatCount > 2) {
                        return ["ok", ""]
                    } else {
                        return ["error", "Repeat Total must be greater than 2"]
                    }
                }
            }
        }
        case Mode.EDIT_HABIT: {
            return {
                title: async (data) => thread(data, required("title", "Title")) as any,
                repeatCount: async (data) => {
                    if(data.repeatCount > 2) {
                        return ["ok", ""]
                    } else {
                        return ["error", "Repeat Total must be greater than 2"]
                    }
                },
            }

        }
    }
}

const GenReadonly = (mode: Mode): ReadonlyMap<FullData> => {
    switch(mode) {
        case Mode.EDIT_HABIT: {
            return {
            }
        } break;
        case Mode.EDIT_GOAL: {
            return {}
        }; break;


        default: {
            return { }
        }
    }
}

const GenHide = (mode: Mode): HideMap<FullData> => {
    switch(mode) {
        case Mode.CREATE_GOAL: {
            return {
                repeatCount: async () => true,
                streakType: async () => true,
                id: async () => true,
            }
        }
        case Mode.EDIT_GOAL: {
            return GenHide(Mode.CREATE_GOAL);
        }
        case Mode.CREATE_HABIT: {
            return {
                id: async () => true,
            }
        }
        case Mode.EDIT_HABIT: {
            return GenHide(Mode.CREATE_HABIT);
        }
    }
}