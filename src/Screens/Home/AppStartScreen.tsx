
import React from "react";
import { View, Text } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView, RowReverseView } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { ScrollView } from "react-native";
import { 
    NavigationRow, ScreenHeader, DocumentView, 
} from "src/Components/Styled/Styled";

import withObservables from "@nozbe/with-observables";
import GoalQuery, { GoalLogic, ActiveGoalQuery } from "src/Models/Goal/GoalQuery";
import TaskQuery, { TaskLogic, ActiveTaskQuery } from "src/Models/Task/TaskQuery";
import EarnedRewardQuery from "src/Models/Reward/EarnedRewardQuery";
import GlobalQuery, { GlobalLogic, Global_Timer, observableWithRefreshTimer } from "src/Models/Global/GlobalQuery";
import { Subscription } from "rxjs";
import EarnedPenaltyQuery from "src/Models/Penalty/EarnedPenaltyQuery";
import { ConnectedTaskList, TaskFilter, TaskSorter, makeTaskLocalState} from "src/ConnectedComponents/Lists/Task/TaskList";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";
import FootSpacer from "src/Components/Basic/FootSpacer";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { MainNavigator, ScreenNavigation, FullNavigation } from "src/common/Navigator";
import { TaskParentTypes } from "src/Models/Task/Task";
import AddModal from "./common/AddModal";

import Dropdown from "src/Components/Styled/Dropdown";
import SidescrollPicker, { makeChoices } from "src/Components/Styled/SidescrollPicker";

interface Props {
    navigation: object;
}


interface State {
    currentDate: Date,
    showMore: boolean;
    showAdd: boolean;
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

    readonly overdueTaskFilterState = makeTaskLocalState<TaskFilter, TaskSorter>("all", "start", undefined, "up");
    readonly todayTaskFilterState = makeTaskLocalState<TaskFilter, TaskSorter>("all", "start", undefined, "up");
    unsub: () => void;
    navigation: MainNavigator<"AppStart">;
    constructor(props: Props) {
        super(props);
        this.state = {
            currentDate: MyDate.Now().toDate(),
            showMore: false,
            showAdd: false,
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

        dispatcher.addEventListener(getKey(this.navigation), this.onClickAdd)
        this.unsub = () => {
            dispatcher.removeEventListener(getKey(this.navigation), this.onClickAdd)
            timeSub.unsubscribe();
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

    render = () => {
        const todayFilters: TaskFilter[] = [
            "all",
        ]

        const todaySorters: TaskSorter[] = [
            "start", "title",
        ]
        return (
            <DocumentView accessibilityLabel={"app-start"}>
                <ScrollView>
                    <SidescrollPicker
                        label={`Due Today`}
                        filters={makeChoices(todayFilters)}
                        sorters={makeChoices(todaySorters)}
                        localState={this.todayTaskFilterState} 
                        accessibilityLabel={"overdue-picker"}
                    ></SidescrollPicker>
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
                        provider={this.todayTaskFilterState}
                        id={undefined}
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
        const overdueFilters: TaskFilter[] = [
            "all" 
        ]
        const overdueSorters: TaskSorter[] = [
            "start", "title",
        ]
        return (
            <View style={{flex: 0}}>
                <SidescrollPicker
                    label={`Overdue`}
                    filters={makeChoices(overdueFilters)}
                    sorters={makeChoices(overdueSorters)}
                    localState={this.overdueTaskFilterState} 
                    accessibilityLabel={"overdue-picker"}
                ></SidescrollPicker>
                <ConnectedTaskList
                    navigation={this.navigation}
                    type={"overdue"}
                    parentId={""}
                    paginate={4}
                    onSwipeRight={(id: string) => {
                        void new TaskLogic(id).complete()
                    }}
                    onTaskAction={this.onTaskAction}
                    provider={this.overdueTaskFilterState}
                    id={undefined}
                ></ConnectedTaskList>
            </View>
        );
    }

}
