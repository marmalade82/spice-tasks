import React from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList"
import { ConnectedGoalSummary } from "src/ConnectedComponents/Summaries/GoalSummary";
import Goal from "src/Models/Goal/Goal";
import GoalQuery, { GoalLogic } from "src/Models/Goal/GoalQuery";
import { DocumentView, ScreenHeader, ListPicker, Toast, BackgroundTitle, ModalIconButton, ModalRow, Modal } from "src/Components/Styled/Styled";
import { ScrollView } from "react-native";
import TaskQuery, { TaskLogic, ActiveTaskQuery, ChildTaskQuery } from "src/Models/Task/TaskQuery";
import FootSpacer from "src/Components/Basic/FootSpacer";
import { TaskParentTypes } from "src/Models/Task/Task";
import {  NavigationStackProp } from "react-navigation-stack";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { GoalType } from "src/Models/Goal/GoalLogic";
import { ConnectedStreakCycleList } from "src/ConnectedComponents/Lists/Group/StreakCycleList";
import StreakCycleQuery, { ChildStreakCycleQuery } from "src/Models/Group/StreakCycleQuery";
import { switchMap } from "rxjs/operators";

import { ScreenNavigation, ScreenParams } from "src/common/Navigator";


interface Props {
    navigation: object;
}

interface State {
    goal?: Goal;
    currentList: number;
    activeCount: number;
    inactiveCount: number;
    currentCycleCount: number;
    previousCycleCount: number;
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

    unsubscribe : () => void;
    navigation: ScreenNavigation<ScreenParams, "Goal">
    constructor(props: Props) {
        super(props);
        this.state = {
            goal: undefined,
            currentList: 0,
            activeCount: 0,
            inactiveCount: 0,
            currentCycleCount: 0,
            previousCycleCount: 0,
            toastVisible: false,
            toastMessage: "",
            showAdd: false,
        }
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

            const activeSub = new ActiveTaskQuery().queryHasParent(goal.id).observeCount().subscribe((num) => {
                this.setState({
                    activeCount: num,
                })
            });
            const inactiveSub = new ChildTaskQuery(goal.id).queryInactive().observeCount().subscribe((num) => {
                this.setState({
                    inactiveCount: num,
                })
            });

            const currentCycleSub = new ChildStreakCycleQuery(goal.id).queryAll().observe().pipe(switchMap(( cycles ) => {
                    const sorted = cycles.sort((a, b) => {
                        return b.startDate.valueOf() - a.startDate.valueOf()
                    })

                    const latest = sorted[0];
                    return new TaskQuery().queryInSCycle(latest ? latest.id : "").observeCount()
                })).subscribe((n) => {
                    this.setState({
                        currentCycleCount: n,
                    })
                })

            const previousCycleSub = new ChildStreakCycleQuery(goal.id)
                                                        .queryEndsOnBefore(goal.currentCycleEnd())
                                                        .observeCount()
                                                        .subscribe((n) => {
                this.setState({
                    previousCycleCount: n,
                })
            })


            this.unsubscribe = () => {
                activeSub.unsubscribe();
                inactiveSub.unsubscribe();
                currentCycleSub.unsubscribe();
                previousCycleSub.unsubscribe();
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
                            onPress={() => {
                                this.navigation.push("AddTask", {
                                    id: "",
                                    parent_id: this.navigation.getParam("id", ""),
                                    parent_type: TaskParentTypes.GOAL,
                                })
                                this.setState({
                                    showAdd: false,
                                })
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
                    return (
                        <View
                            style={{
                                flex: 0,
                            }}
                        >
                            <BackgroundTitle title={`${getCurrentCycleType()} (${this.state.currentCycleCount})`}
                                style={{
                                }}
                            ></BackgroundTitle>

                            <ConnectedTaskList
                                navigation={this.navigation}
                                parentId={this.navigation.getParam('id', '')}
                                type={"current-cycle"}
                                paginate={4}
                                onSwipeRight={(id: string) => {
                                    this.onTaskAction(id, "complete")
                                }}
                                emptyText={"No active tasks"}
                                onTaskAction={this.onTaskAction}
                            ></ConnectedTaskList>

                            <BackgroundTitle title={`Previous ${getCycleType()}s (${this.state.previousCycleCount})`}
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
                    return (
                        <View
                            style={{
                                flex: 0
                            }}
                        >
                            <BackgroundTitle title={`Active (${this.state.activeCount})`}
                                style={{
                                }}
                            ></BackgroundTitle>
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
                            ></ConnectedTaskList>
                            <BackgroundTitle title={`Inactive (${this.state.inactiveCount})`}
                                style={{
                                }}
                            ></BackgroundTitle>
                            <ConnectedTaskList
                                navigation={this.navigation}
                                parentId={this.navigation.getParam('id', '')}
                                paginate={4}
                                emptyText={"No inactive subtasks"}
                                type={"parent-inactive"}
                                onTaskAction={this.onTaskAction}
                            ></ConnectedTaskList>
                        </View>
                    ) 
                }
            }
        }

        return null;
    }
}
