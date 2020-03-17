import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddGoalForm, AddGoalData, AddGoalDefault, ValidateGoalForm } from "src/Components/Forms/AddGoalForm";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { GoalQuery, Goal, IGoal, GoalLogic } from "src/Models/Goal/GoalQuery";
import { ColumnView, TouchableView } from "src/Components/Basic/Basic";
import { DocumentView, ScreenHeader, Toast, IconButton, Icon } from "src/Components/Styled/Styled";
import { RecurLogic } from "src/Models/Recurrence/RecurQuery";
import Recur from "src/Models/Recurrence/Recur";
import MyDate from "src/common/Date";
import RewardQuery from "src/Models/Reward/RewardQuery";
import Reward from "src/Models/Reward/Reward";
import { Observable } from "rxjs";
import { LabelValue } from "src/common/types";
import PenaltyQuery, { Penalty } from "src/Models/Penalty/PenaltyQuery";
import SaveButton from "src/Components/Basic/SaveButton";

import { NavigationStackProp} from "react-navigation-stack";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderSaveButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "src/Screens/common/screenUtils";
import { FullNavigation, MainNavigator, ScreenNavigation } from "src/common/Navigator";


interface Props {
    navigation: object;
}

interface State { 
    data: AddGoalData
    goal?: Goal
    toast: string;
    showToast: boolean;
}

type OmitFromGoal = "parentId" | "state" | "active" | "lastRefreshed" | 
                     "streakDailyStart" | 
                    "streakWeeklyStart" | "streakMonthlyStart"

var dispatcher = new EventDispatcher();

export default class AddGoalScreen extends React.Component<Props, State> {
    navigation: MainNavigator<"AddGoal">
    goalFormRef: React.RefObject<AddGoalForm>;
    constructor(props) {
        super(props);
        this.state = {
            data: AddGoalDefault(),
            toast: "",
            showToast: false,
        }
        this.goalFormRef = React.createRef();
        this.navigation = new ScreenNavigation(this.props);
    }
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Goal',
            right: [
                () => {
                    return (
                        <HeaderSaveButton
                            eventName={getKey(navigation)}
                            dispatcher={dispatcher}
                        ></HeaderSaveButton>
                    )
                }
            ]
        }
    }

    componentDidMount = async () => {
        const id = this.navigation.getParam('id', '');
        const goal = await new GoalQuery().get(id); 
        if(goal) {
            let data: AddGoalData = {
                title : goal.title,
                details: goal.details,
                type : goal.goalType,
                start_date : goal.startDate,
                due_date : goal.dueDate,
                reward: goal.rewardType,
                penalty: goal.penaltyType,
                streakData: {
                    minimum: goal.streakMinimum,
                    type: goal.streakType as any,
                },
                repeats: AddGoalDefault().repeats,
                rewardId: goal.rewardId,
                penaltyId: goal.penaltyId,
            }
            this.setState({
                goal: goal,
                data: data,
            })
        } else {
            this.setState({
                goal: undefined
            })
        }
        dispatcher.addEventListener(getKey(this.navigation), this.onSave);
    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.navigation), this.onSave);
    }


    onSave = async () => {
        let message : string | undefined = undefined;
        if(this.goalFormRef.current) {
            message = ValidateGoalForm(this.goalFormRef.current);
        }

        if(message !== undefined) {
            this.setState({
                showToast: true,
                toast: message,
            });
        } else {
            const data = this.state.data;
            const streak = data.streakData;
            const goalData: Partial<IGoal> = {
                title: data.title,
                goalType: data.type,
                startDate: data.start_date,
                dueDate: data.due_date,
                streakMinimum: streak.minimum,
                streakType: streak.type,
                rewardType: data.reward,
                penaltyType: data.penalty,
                details: data.details,
                rewardId: data.rewardId,
                penaltyId: data.penaltyId,
            };

            if(this.state.goal) {
                const message = await new GoalLogic(this.state.goal.id).update(goalData)
                if(message !== undefined) {
                    // update was not successful, we have an error message.
                    this.setState({
                        showToast: true,
                        toast: message,
                    })
                } else {
                    // update was successful
                    this.navigation.goBack();
                }
            } else {
                void GoalLogic.create(goalData, data.repeats)

                this.navigation.goBack();
            }
        }
    }
 

    render = () => {
        return (
            <DocumentView>
                { this.renderGoalForm() }
                <Toast
                    visible={this.state.showToast}
                    message={this.state.toast}
                    onToastDisplay={() => {
                        this.setState({
                            showToast: false
                        });
                    }}
                ></Toast>
            </DocumentView>
        );
    }

    rewardChoices = () => {
        let obs: Observable<LabelValue[]> = new Observable((subscriber) => {
            new RewardQuery().queryAll().observe().subscribe((rewards) => {
                const lvs = (rewards as Reward[]).map((reward) => {
                    return {
                        label: reward.title,
                        value: reward.id,
                        key: reward.id,
                    }
                });
                subscriber.next(lvs);
            })
        })
        return obs;
    }

    penaltyChoices = () => {
        let obs: Observable<LabelValue[]> = new Observable((subscriber) => {
            new PenaltyQuery().queryAll().observe().subscribe((penalties) => {
                const lvs = (penalties as Penalty[]).map((penalty) => {
                    return {
                        label: penalty.title,
                        value: penalty.id,
                        key: penalty.id,
                    }
                });
                subscriber.next(lvs);
            })
        });
        return obs;
    }

    renderGoalForm = () => {
        const id = this.navigation.getParam('id', '');
        return (
            <AddGoalForm
                navigation={this.navigation}
                onDataChange={(data: AddGoalData) => {
                    this.setState({
                        data: data
                    })
                }}
                data={this.state.data}
                rewardChoices={this.rewardChoices()}
                penaltyChoices={this.penaltyChoices()}
                ref={this.goalFormRef}
                formType={ id ? "update" : "create"}
            ></AddGoalForm>
        );
    }
}