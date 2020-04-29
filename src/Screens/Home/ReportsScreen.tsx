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
    showAdd: boolean;
}

const dispatcher = new EventDispatcher();

export default class ReportsScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Reports',
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
    navigation: MainNavigator<"Reports">;
    constructor(props: Props) {
        super(props);
        this.state = {
            showAdd: false,
        }
        this.unsub = () => {}
        this.navigation = new ScreenNavigation(this.props);
    }

    componentDidMount = async () => {

        dispatcher.addEventListener(getKey(this.navigation), this.onClickAdd)
        this.unsub = () => {
            dispatcher.removeEventListener(getKey(this.navigation), this.onClickAdd)
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
        const todayFilters: TaskFilter[] = [
            "all",
        ]

        const todaySorters: TaskSorter[] = [
            "start", "title",
        ]
        return (
            <DocumentView accessibilityLabel={"app-start"}>
                <ScrollView>

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
}
