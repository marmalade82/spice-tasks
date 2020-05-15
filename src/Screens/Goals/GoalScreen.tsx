import React from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { ConnectedTaskList, TaskFilter, TaskSorter, makeTaskLocalState } from "src/ConnectedComponents/Lists/Task/TaskList"
import { ConnectedGoalSummary } from "src/ConnectedComponents/Summaries/GoalSummary";
import Goal from "src/Models/Goal/Goal";
import GoalQuery, { GoalLogic } from "src/Models/Goal/GoalQuery";
import { DocumentView, ScreenHeader, ListPicker, Toast, BackgroundTitle, ModalRow, Modal } from "src/Components/Styled/Styled";
import { ScrollView } from "react-native";
import TaskQuery, { TaskLogic, ActiveTaskQuery, ChildTaskQuery, ChildOfTaskQuery } from "src/Models/Task/TaskQuery";
import FootSpacer from "src/Components/Basic/FootSpacer";
import { TaskParentTypes } from "src/Models/Task/Task";
import {  NavigationStackProp } from "react-navigation-stack";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { GoalType } from "src/Models/Goal/GoalLogic";
import { ConnectedStreakCycleList } from "src/ConnectedComponents/Lists/Group/StreakCycleList";
import StreakCycleQuery, { ChildStreakCycleQuery } from "src/Models/Group/StreakCycleQuery";
import { switchMap, merge } from "rxjs/operators";

import { ScreenNavigation, ScreenParams } from "src/common/Navigator";
import MyDate from "src/common/Date";
import { combineLatest, Observable } from "rxjs";
import SidescrollPicker, { makeChoices } from "src/Components/Styled/SidescrollPicker";
import { LocalState } from "../common/StateProvider";
import CycleScreen from "./CycleScreen";
import StreakCycle from "src/Models/Group/StreakCycle";


interface Props {
    navigation: object;
}

interface State {
    goal?: Goal;
    currentList: number;
    toastVisible: boolean;
    toastMessage: string;
    showAdd: boolean;
}

const dispatcher = new EventDispatcher();


export default class GoalScreen extends React.Component<Props, State> {

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam("title", 'Goal'),
            right: [
                () => {
                    return (
                        <HeaderAddButton
                            dispatcher={dispatcher}
                            eventName={getKey(navigation)}
                        ></HeaderAddButton>
                    )
                }
            ]
        }
    }

    readonly taskFilterState: LocalState<{ filter: TaskFilter, range: undefined | [Date, Date], direction: "up" | "down", sorter: TaskSorter }>
    readonly activeTaskFilterState = makeTaskLocalState<TaskFilter, TaskSorter>("all", "start", undefined, "up");
    readonly inactiveTaskFilterState = makeTaskLocalState<TaskFilter, TaskSorter>("all", "start", undefined, "up")
    unsubscribe : () => void;
    navigation: ScreenNavigation<ScreenParams, "Goal">
    constructor(props: Props) {
        super(props);
        this.state = {
            goal: undefined,
            currentList: 0,
            toastVisible: false,
            toastMessage: "",
            showAdd: false,
        }
        this.taskFilterState = new LocalState({
                filter: "all",
                range: undefined,
                direction: "up",
                sorter: "start"
            } as const);
        this.navigation = new ScreenNavigation(this.props);
        this.unsubscribe = () => {};
    }

    componentDidMount = async () => {
        const id = this.navigation.getParam('id', '');
        const goal = await new GoalQuery().get(id); 

        if(goal) {
            this.setState({
                goal: goal
            })

            this.unsubscribe = () => {
            }
        } else {
            this.setState({
                goal: undefined
            });
        }

        dispatcher.addEventListener(getKey(this.navigation), this.onClickAdd)
    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.navigation), this.onClickAdd)
        this.unsubscribe()
    }

    onClickAdd = () => {
        this.setState({
            showAdd: true,
        })
    }

    onEditGoal = () => {
        const params = {
            id: this.navigation.getParam('id', ''),
            parent_id: "",
            title: this.state.goal && this.state.goal.goalType === GoalType.STREAK ? "Habit" : "Goal"
        } as const;
        this.navigation.navigate('AddGoal', params);
    }

    onCompleteGoal = async () => {
        const id = this.navigation.getParam("id", "");
        const message = await new GoalLogic(id).complete();

        if(message !== undefined) {
            this.setState({
                toastVisible: true,
                toastMessage: message,
            })
        } else {
            // completing was a success, so do nothing
            message
        }
    }

    onFailGoal = async () => {
        const id = this.navigation.getParam("id", "");
        void new GoalLogic(id).fail();
    }

    onModalChoice = async (s: "complete" | "delete" | "incomplete") => {
        switch(s) {
            case "complete": {
                await this.onCompleteGoal();
            } break;
            case "incomplete": {
                void this.onFailGoal();
            }
            default: {

            }
        }

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
        return (
            <DocumentView accessibilityLabel={"goal"}>
                <ScrollView>
                    {this.renderSummary()}
                    {this.renderLists()}
                    <FootSpacer></FootSpacer>
                </ScrollView>
                <Toast
                    visible={this.state.toastVisible}
                    message={this.state.toastMessage}
                    onToastDisplay={() => {
                        this.setState({
                            toastVisible: false,
                        })
                    }}
                ></Toast>
                <Modal
                    visible={this.state.showAdd}
                    onRequestClose={() => {
                        this.setState({
                            showAdd: false,
                        })
                    }}
                >
                        <ModalRow
                            text={"Task"}
                            iconType={"task"}
                            iconBackground={"white"}
                            onPress={async () => {
                                const goal = await new GoalQuery().get(this.navigation.getParam("id", ""));
                                if(goal) {
                                    if(goal.isStreak()) {
                                        const cycle: StreakCycle = await new GoalLogic(this.navigation.getParam("id", "")).generateCurrentCycle()
                                        this.navigation.push("AddTask", {
                                            id: "",
                                            parent_id: cycle.id,
                                            parent_type: TaskParentTypes.CYCLE,
                                        })
                                    } else {
                                        this.navigation.push("AddTask", {
                                            id: "",
                                            parent_id: this.navigation.getParam("id", ""),
                                            parent_type: TaskParentTypes.GOAL,
                                        })
                                        this.setState({
                                            showAdd: false,
                                        })
                                    }
                                }

                            }}
                            accessibilityLabel={"add-goal-button"}
                            key={"add"}
                        ></ModalRow>
                </Modal>
            </DocumentView>
        );
    }


    private renderSummary = () => {
        if(this.state.goal) {
            return (
                    <ConnectedGoalSummary
                        goal={this.state.goal} 
                        navigation={this.navigation}
                        onModalChoice={this.onModalChoice}
                        key={"summary"}
                    ></ConnectedGoalSummary>
            );
        } else {
            return <View></View>
        }
    }

    private renderLists = () => {
        const goal = this.state.goal
        if(goal) {
            var getCycleType = () => {
                switch(goal.streakType) {
                    case "daily": return "Day";
                    case "weekly": return "Week";
                    case "monthly": return "Month";
                }
            }

            var getCurrentCycleType = () => {
                switch(goal.streakType) {
                    case "daily": return "Today";
                    case "weekly": return "This Week";
                    case "monthly": return "This Month";
                }
            }

            switch(goal.goalType) {
                case GoalType.STREAK: {
                    const habitIsOverdue = MyDate.Now().toDate() > goal.dueDate
                    const habitHasNotStarted = MyDate.Now().toDate() < goal.startDate
                    let filters: TaskFilter[] = [
                        "all", "complete", "failed", 'ongoing',
                    ]
                    let sorters: TaskSorter[] = [
                        "start", "due", "title"
                    ]
                    return (
                        <View
                            style={{
                                flex: 0
                            }}
                        >
                            <SidescrollPicker
                                label={ habitHasNotStarted ?
                                    `First Tasks` : habitIsOverdue ?
                                    `Overdue` :
                                    `${getCurrentCycleType()}`
                                }
                                filters={makeChoices(filters)}
                                sorters={makeChoices(sorters)}
                                localState={this.taskFilterState} 
                                accessibilityLabel={"picker"}
                            ></SidescrollPicker>
                            <ConnectedTaskList
                                navigation={this.navigation}
                                parentId={this.navigation.getParam('id', '')}
                                type={ habitIsOverdue ?
                                    "overdue-in-goal" :
                                    "current-cycle"
                                }
                                paginate={4}
                                onSwipeRight={(id: string) => {
                                    this.onTaskAction(id, "complete")
                                }}
                                emptyText={"No active tasks"}
                                onTaskAction={this.onTaskAction}
                                provider={this.taskFilterState}
                                id={undefined}
                            ></ConnectedTaskList>
                            <BackgroundTitle 
                                title={ habitHasNotStarted ?
                                    `First ${getCycleType()}` :
                                    `Previous ${getCycleType()}`
                                }
                                style={{
                                }}
                            ></BackgroundTitle>

                            <ConnectedStreakCycleList
                                navigation={this.navigation}
                                type={"previous"}
                                goalId={this.navigation.getParam('id', '')}
                                paginate={4}
                            ></ConnectedStreakCycleList>
                        </View>
                    )
                } break;
                default: {
                    let activeFilters: TaskFilter[] = [
                        "all", 'ongoing', "not started", "overdue",
                    ]
                    let activeSorters: TaskSorter[] = [
                        "start", "title"
                    ]

                    let inactiveFilters: TaskFilter[] = [
                        "all", "complete", "failed",
                    ]

                    let inactiveSorters: TaskSorter[] = [
                        "start", "title",
                    ]
                    return (
                        <View
                            style={{
                                flex: 0
                            }}
                        >
                            <SidescrollPicker
                                label={ `Active` }
                                filters={makeChoices(activeFilters)}
                                sorters={makeChoices(activeSorters)}
                                localState={this.activeTaskFilterState} 
                                accessibilityLabel={"active-picker"}
                            ></SidescrollPicker>
                            <ConnectedTaskList
                                navigation={this.navigation}
                                parentId={this.navigation.getParam('id', '')}
                                type={"parent-active"}
                                paginate={4}
                                onSwipeRight={(id: string) => {
                                    this.onTaskAction(id, "complete")
                                }}
                                emptyText={"No active subtasks"}
                                onTaskAction={this.onTaskAction}
                                provider={this.activeTaskFilterState}
                                id={undefined}
                            ></ConnectedTaskList>

                            <BackgroundTitle title={`Inactive`}
                                style={{
                                }}
                            ></BackgroundTitle>
                            <SidescrollPicker
                                label={`Inactive`}
                                filters={makeChoices(inactiveFilters)}
                                sorters={makeChoices(inactiveSorters)}
                                localState={this.inactiveTaskFilterState} 
                                accessibilityLabel={"inactive-picker"}
                            ></SidescrollPicker>
                            <ConnectedTaskList
                                navigation={this.navigation}
                                parentId={this.navigation.getParam('id', '')}
                                paginate={4}
                                emptyText={"No inactive subtasks"}
                                type={"parent-inactive"}
                                onTaskAction={this.onTaskAction}
                                provider={this.inactiveTaskFilterState}
                                id={undefined}
                            ></ConnectedTaskList>
                        </View>
                    ) 
                }
            }
        }

        return null;
    }
}
