import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddGoalForm, AddGoalData, AddGoalDefault, ValidateGoalForm } from "src/Components/Forms/AddGoalForm";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { GoalQuery, Goal, IGoal } from "src/Models/Goal/GoalQuery";
import { ColumnView } from "src/Components/Basic/Basic";
import { DocumentView, ScreenHeader, Toast, IconButton } from "src/Components/Styled/Styled";
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
import { Single, Child, None } from "App";


interface Props {
    navigation: NavigationStackProp<Child>
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

export default class AddGoalScreen extends React.Component<Props, State> {
    goalFormRef: React.RefObject<AddGoalForm>;
    constructor(props) {
        super(props);
        this.state = {
            data: AddGoalDefault(),
            toast: "",
            showToast: false,
        }
        this.goalFormRef = React.createRef();
    }
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Goal',
        }
    }

    componentDidMount = async () => {
        const id = this.props.navigation.getParam('id', '');
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
                goalData.latestCycleStartDate = new MyDate(goalData.startDate).prevMidnight().toDate();
                void new GoalQuery().update(this.state.goal, goalData)
                    .catch((reason) => {
                        console.log("Failed to update existing goal with reason: " + reason);
                    });

                this.props.navigation.goBack();
            } else {
                // Whether a goal is recurring can only be set in this form on creation. Otherwise it needs to be handled elsewhere.
                let recur: Recur | null = await RecurLogic.createForGoal(data.repeats);

                if(recur) {
                    goalData.recurId = recur.id;
                }

                void new GoalQuery().create(goalData)
                    .catch((reason) => {
                        console.log("Failed to create goal with reason: " + reason);
                    });  

                this.props.navigation.goBack();
            }
        }
    }
 

    render = () => {
        return (
            <DocumentView>
                { this.renderGoalForm() }
                <SaveButton
                    onSave={this.onSave}
                ></SaveButton>
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
        const id = this.props.navigation.getParam('id', '');
        return (
            <AddGoalForm
                navigation={this.props.navigation}
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