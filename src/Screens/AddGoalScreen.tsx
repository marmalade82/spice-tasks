import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddGoalForm, AddGoalData, AddGoalDefault } from "src/Components/Forms/AddGoalForm";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { GoalQuery, Goal } from "src/Models/Goal/GoalQuery";
import { ConnectedAddGoalForm } from "src/ConnectedComponents/Forms/AddGoalForm";
import { AddGoal } from "src/Screens";

interface Props {
    navigation: any;
}

interface State { 
    data: AddGoalData
    goal?: Goal
}

const localStyle = StyleSheet.create({
    container: {
        paddingLeft: "2%",
        paddingRight: "2%",
        paddingTop: "2%",
        paddingBottom: "2%",
    },
});


export default class AddGoalScreen extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            data: AddGoalDefault(),
        }
    }
    static navigationOptions = ({navigation}) => {
        return {
            title: 'New Goal',
        }
    }

    componentDidMount = async () => {
        const id = this.props.navigation.getParam('id', '');
        const goal = await GoalQuery.get(id); 
        if(goal) {
            let data: AddGoalData = {
                title : goal.title,
                type : goal.goalType,
                start_date : goal.startDate,
                due_date : goal.dueDate,
                recurring: AddGoalDefault().recurring,
                recurData: AddGoalDefault().recurData,
                reward: AddGoalDefault().reward,
                penalty: AddGoalDefault().penalty,
                streakData: {
                    minimum: goal.streakMinimum,
                    type: goal.streakType,
                    daily_start: goal.streakDailyStart,
                    weekly_start: goal.streakWeeklyStart,
                    monthly_start: goal.streakMonthlyStart,
                }
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

    renderGoalForm = () => {
        if(this.state.goal) {
            return (
                <AddGoalForm
                    navigation={this.props.navigation}
                    onDataChange={(data: AddGoalData) => {
                        this.setState({
                            data: data
                        })
                    }}
                    data={this.state.data}
                ></AddGoalForm>
            );
        } else {
            return (
                <AddGoalForm 
                    navigation={this.props.navigation}
                    data={this.state.data}
                    onDataChange={(data: AddGoalData)=>{
                        this.setState({
                            data: data
                        });
                    }}
                />
            );
        }
    }
 

    render = () => {
        return (
            <SafeAreaView style={[Style.container, Style.greenBg, localStyle.container]}>
                { this.renderGoalForm() }
                <Button
                    title={"SAVE"}
                    onPress={() => {
                        const data = this.state.data;
                        const streak = data.streakData;
                        GoalQuery.create({
                            title: data.title,
                            goalType: data.type,
                            startDate: data.start_date,
                            dueDate: data.due_date,
                            streakMinimum: streak.minimum,
                            streakType: streak.type,
                            streakDailyStart: streak.daily_start,
                            streakWeeklyStart: streak.weekly_start,
                            streakMonthlyStart: streak.monthly_start,
                        })
                        .catch((reason) => {
                            console.log("FAILED: " + reason)
                        });  // Nothing to do if create fail -- since it should never fail
                    }}
                />

            </SafeAreaView>
        );
    }
}