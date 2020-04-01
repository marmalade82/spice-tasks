
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
import { MainNavigator, ScreenNavigation, FullNavigation } from "src/common/Navigator";
import { TaskParentTypes } from "src/Models/Task/Task";
import AddModal from "./common/AddModal";

import Dropdown from "src/Components/Styled/Dropdown";

interface Props {
    navigation: object;
}


interface State {
    currentDate: Date,
    showMore: boolean;
    showAdd: boolean;
    dueTodayCount: number;
    inProgressCount: number;
    overdueCount: number;
    ongoingGoalsCount: number;
    current: string;
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
    navigation: MainNavigator<"AppStart">;
    constructor(props: Props) {
        super(props);
        this.state = {
            currentDate: MyDate.Now().toDate(),
            showMore: false,
            showAdd: false,
            dueTodayCount: 0,
            inProgressCount: 0,
            overdueCount: 0,
            ongoingGoalsCount: 0,
            current: 'bye',
        }
        this.unsub = () => {}
        this.navigation = new ScreenNavigation(this.props);
    }

    componentDidMount = async () => {
        let timeSub: Subscription = Global_Timer.subscribe(() => {
            this.setState({
                currentDate: MyDate.Now().toDate()
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
        dispatcher.addEventListener(getKey(this.navigation), this.onClickAdd)
        this.unsub = () => {
            dispatcher.removeEventListener(getKey(this.navigation), this.onClickAdd)
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

    private onClickAdd = () => {
        this.setState({
            showAdd: true,
        })
    }

    private onTaskAction = (id: string, action: "complete" | "fail") => {
        switch(action) {
            case "complete": {
                void new TaskLogic(id).complete();
            } break; 
            case "fail": {
                void new TaskLogic(id).fail();
            } break;
        }
    }

    private onGoalAction = (id: string, action: "complete" | "fail") => {
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
            <DocumentView accessibilityLabel={"app-start"}>
                <ScrollView>

                    <BackgroundTitle title={`Due Today (${this.state.dueTodayCount})`}
                        style={{
                            marginTop: 0,
                        }}
                    ></BackgroundTitle>
                    <ConnectedTaskList
                        navigation={this.navigation}
                        type={"due-today"}
                        parentId={""}
                        paginate={4}
                        onSwipeRight={(id: string) => {
                            void new TaskLogic(id).complete()
                        }}
                        emptyText={"Congrats! You're done with your tasks for today."}
                        onTaskAction={this.onTaskAction}
                    ></ConnectedTaskList>

                    {this.renderOverdue()}

                    <FootSpacer></FootSpacer>
                </ScrollView>
                <AddModal
                    visible={this.state.showAdd}
                    onRequestClose={() => this.setState({ showAdd: false })}
                    navigation={this.navigation}
                ></AddModal>
            </DocumentView>
        );
    }

    private renderOverdue = () => {
        if( this.state.overdueCount > 0) {
            return (
                <View style={{flex: 0}}>
                    <BackgroundTitle title={`Overdue (${this.state.overdueCount})`}
                        style={{ 
                        }}
                    ></BackgroundTitle>
                    <ConnectedTaskList
                        navigation={this.navigation}
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

}
