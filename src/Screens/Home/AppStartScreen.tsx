
import React from "react";
import { View, Text } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView, RowReverseView } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { ScrollView } from "react-native";
import { 
    NavigationRow, ScreenHeader, DocumentView, 
    NavigationGroup, BackgroundTitle, Summary ,
    IconButton, ModalRow, ModalIconButton, Icon, Modal,
} from "src/Components/Styled/Styled";

import { 
    CONTAINER_VERTICAL_MARGIN, ROW_CONTAINER_HEIGHT, Styles, 
    LEFT_SECOND_MARGIN, PRIMARY_COLOR_LIGHT, LEFT_FIRST_MARGIN, ICON_CONTAINER_WIDTH, RIGHT_SECOND_MARGIN, ROW_HEIGHT
} from "src/Components/Styled/Styles";
import withObservables from "@nozbe/with-observables";
import GoalQuery, { GoalLogic, ActiveGoalQuery } from "src/Models/Goal/GoalQuery";
import TaskQuery, { TaskLogic, ActiveTaskQuery } from "src/Models/Task/TaskQuery";
import EarnedRewardQuery from "src/Models/Reward/EarnedRewardQuery";
import GlobalQuery, { GlobalLogic, Global_Timer, observableWithRefreshTimer } from "src/Models/Global/GlobalQuery";
import { Subscription } from "rxjs";
import EarnedPenaltyQuery from "src/Models/Penalty/EarnedPenaltyQuery";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";
import FootSpacer from "src/Components/Basic/FootSpacer";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";

interface Props {
    navigation: any;
}


interface State {
    currentDate: Date,
    showMore: boolean;
    showAdd: boolean;
    dueTodayCount: number;
    inProgressCount: number;
    overdueCount: number;
    ongoingGoalsCount: number;
}

const dispatcher = new EventDispatcher();

export default class AppStartScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'App Start!',
            right: [
                () => { return (
                    <HeaderAddButton
                        dispatcher={dispatcher}
                        eventName={getKey(navigation)}
                    ></HeaderAddButton>
                )}
            ],
        }
    }

    unsub: () => void;
    constructor(props: Props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            showMore: false,
            showAdd: false,
            dueTodayCount: 0,
            inProgressCount: 0,
            overdueCount: 0,
            ongoingGoalsCount: 0,
        }
        this.unsub = () => {}
    }

    componentDidMount = async () => {
        let timeSub: Subscription = Global_Timer.subscribe(() => {
            this.setState({
                currentDate: new Date()
            })
        });

        let dueTodaySub: Subscription = observableWithRefreshTimer(
            () => new ActiveTaskQuery().queryDueToday().observeCount() ).subscribe((count) => {
                this.setState({
                    dueTodayCount: count,
                })
            })

        let inProgressSub: Subscription = observableWithRefreshTimer(
            () => new ActiveTaskQuery().queryStartedButNotDue().observeCount()).subscribe((count) => {
                this.setState({
                    inProgressCount: count
                })
            });

        let overdueSub: Subscription = observableWithRefreshTimer(
            () => new ActiveTaskQuery().queryOverdue().observeCount()).subscribe((count) => {
                this.setState({
                    overdueCount: count
                })
            });

        let ongoingGoalsSub: Subscription = observableWithRefreshTimer(
            () => new ActiveGoalQuery().queryStarted().observeCount()).subscribe((count) => {
                this.setState({
                    ongoingGoalsCount: count
                })
            }) ;
        dispatcher.addEventListener(getKey(this.props.navigation), this.onClickAdd)
        this.unsub = () => {
            dispatcher.removeEventListener(getKey(this.props.navigation), this.onClickAdd)
            timeSub.unsubscribe();
            dueTodaySub.unsubscribe();
            inProgressSub.unsubscribe();
            overdueSub.unsubscribe();
            ongoingGoalsSub.unsubscribe();
        }
    }

    componentWillUnmount = () => {
        this.unsub();
    }

    onClickAdd = () => {
        this.setState({
            showAdd: true,
        })
    }

    onTaskAction = (id: string, action: "complete" | "fail") => {
        switch(action) {
            case "complete": {
                void new TaskLogic(id).complete();
            } break; 
            case "fail": {
                void new TaskLogic(id).fail();
            } break;
        }
    }

    onGoalAction = (id: string, action: "complete" | "fail") => {
        switch(action) {
            case "complete": {
                void new GoalLogic(id).complete();
            } break;
            case "fail":{
                void new GoalLogic(id).fail();
            } break;
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ScrollView>

                    <BackgroundTitle title={`Due Today (${this.state.dueTodayCount})`}
                        style={{
                            marginTop: 0,
                        }}
                    ></BackgroundTitle>
                    <ConnectedTaskList
                        navigation={this.props.navigation}
                        type={"due-today"}
                        parentId={""}
                        paginate={4}
                        onSwipeRight={(id: string) => {
                            void new TaskLogic(id).complete()
                        }}
                        emptyText={"Congrats! You're done with your tasks for today."}
                        onTaskAction={this.onTaskAction}
                    ></ConnectedTaskList>

                    { this.renderInProgress() }

                    {this.renderOverdue()}

                    {this.renderOngoingGoals()}

                    <FootSpacer></FootSpacer>
                </ScrollView>
                <Modal
                    visible={this.state.showAdd}
                    onRequestClose={() => this.setState({ showAdd: false})}
                >
                        <ModalRow
                            text={"Goal"}
                            iconType={"goal"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.props.navigation.navigate("AddGoal")
                                this.setState({
                                    showAdd: false,
                                })
                            }}
                        ></ModalRow>
                        <ModalRow
                            text={"Task"}
                            iconType={"task"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.props.navigation.navigate("AddTask")
                                this.setState({
                                    showAdd: false,
                                })
                            }}
                        ></ModalRow>
                        <ModalRow
                            text={"Reward"}
                            iconType={"reward"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.props.navigation.navigate("AddReward")
                                this.setState({
                                    showAdd: false,
                                })
                            }}
                        ></ModalRow>
                        <ModalRow
                            text={"Penalty"}
                            iconType={"penalty"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.props.navigation.navigate("AddPenalty")
                                this.setState({
                                    showAdd: false,
                                })
                            }}
                        ></ModalRow>
                </Modal>
            </DocumentView>
        );
    }

    renderInProgress = () => {
        if( this.state.inProgressCount > 0) {
            return (
                <View style={{flex: 0}}>
                    <BackgroundTitle title={`In Progress (${this.state.inProgressCount})`}
                        style={{
                        }}
                    ></BackgroundTitle>
                    <ConnectedTaskList
                        navigation={this.props.navigation}
                        type={"in-progress-but-not-due-today"}
                        parentId={""}
                        paginate={4}
                        onSwipeRight={(id: string) => {
                            void new TaskLogic(id).complete()
                        }}
                        onTaskAction={this.onTaskAction}
                    ></ConnectedTaskList>
                </View>
            )
        }
        return null;
    }

    renderOverdue = () => {
        if( this.state.overdueCount > 0) {
            return (
                <View style={{flex: 0}}>
                    <BackgroundTitle title={`Overdue (${this.state.overdueCount})`}
                        style={{ 
                        }}
                    ></BackgroundTitle>
                    <ConnectedTaskList
                        navigation={this.props.navigation}
                        type={"overdue"}
                        parentId={""}
                        paginate={4}
                        onSwipeRight={(id: string) => {
                            void new TaskLogic(id).complete()
                        }}
                        onTaskAction={this.onTaskAction}
                    ></ConnectedTaskList>
                </View>
            );
        }
        return null;
    }

    renderOngoingGoals = () => {
        if( this.state.ongoingGoalsCount > 0) {
            return (
                <View style={{flex: 0}}>
                    <BackgroundTitle title={`Ongoing Goals (${this.state.ongoingGoalsCount})`}
                        style={{
                        }}
                    ></BackgroundTitle>

                    <ConnectedGoalList
                        navigation={this.props.navigation}
                        type={"ongoing"}
                        paginate={4}
                        onSwipeRight={(id: string) => {
                            void new GoalLogic(id).complete();
                        }}
                        onGoalAction={this.onGoalAction}
                    ></ConnectedGoalList>
                </View>
            );
        }

        return null;
    }

}


interface StatusListProps {
    overdueTaskCount: number;
    remainingTodayTaskCount: number;
    inProgressGoalsCount: number;
    earnedRewardsCount: number;
    earnedPenaltiesCount: number;
    navigation: any;
}
const AdaptedStatusList: React.FunctionComponent<StatusListProps> = (props: StatusListProps) => {

    return (
        <NavigationGroup
            navigation={props.navigation}
            style={{
                marginBottom: 0
            }}
            rows={[
                { text: "Tasks Remaining"
                , number: props.remainingTodayTaskCount
                , navParams: {}
                , navDestination: "RemainingTasks"
                },
                { text: "Overdue"
                , number: props.overdueTaskCount
                , navParams: {}
                , navDestination: "Overdue"
                },
                { text: "Goals In Progress"
                , number: props.inProgressGoalsCount
                , navParams: {}
                , navDestination: "InProgressGoals"
                },
                { text: "Unused Rewards"
                , number: props.earnedRewardsCount
                , navParams: {}
                , navDestination: "UnusedEarnedRewards"
                },
                { text: "Pending Penalties"
                , number: props.earnedPenaltiesCount
                , navParams: {}
                , navDestination: "UnusedEarnedPenalties"
                },
            ]}
        >
        </NavigationGroup>
    );
}

interface AllStatusListProps {
    navigation: any
}

/**
 * TODO : earnedRewardsCount and earnedPenaltiesCount are still incorrect.
 * TODO :   It is very likely that earned rewards are unnecessary -- no need to make user
 * TODO :   perform the action. Just generate the reward for them automatically.
 */
const enhance = withObservables([], (_props: AllStatusListProps) => {
    return {
        overdueTaskCount: observableWithRefreshTimer(() => new ActiveTaskQuery().queryOverdue().observeCount()),
        remainingTodayTaskCount: observableWithRefreshTimer(() => new ActiveTaskQuery().queryRemainingToday().observeCount()),
        inProgressGoalsCount: observableWithRefreshTimer(() => new ActiveGoalQuery().queryStartedButNotDue().observeCount()),
        earnedRewardsCount: observableWithRefreshTimer(() => new EarnedRewardQuery().queryUnused().observeCount()),
        earnedPenaltiesCount: observableWithRefreshTimer(() => new EarnedPenaltyQuery().queryUnused().observeCount()),
    }
});

var ConnectedStatusList = enhance(AdaptedStatusList);

