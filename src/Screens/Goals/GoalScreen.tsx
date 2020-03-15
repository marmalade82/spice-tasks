import React from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList"
import { ConnectedGoalSummary } from "src/ConnectedComponents/Summaries/GoalSummary";
import Goal from "src/Models/Goal/Goal";
import GoalQuery, { GoalLogic } from "src/Models/Goal/GoalQuery";
import { DocumentView, ScreenHeader, ListPicker, Toast, BackgroundTitle, ModalIconButton, ModalRow, Modal } from "src/Components/Styled/Styled";
import { ScrollView } from "react-native";
import TaskQuery, { TaskLogic } from "src/Models/Task/TaskQuery";
import FootSpacer from "src/Components/Basic/FootSpacer";
import { TaskParentTypes } from "src/Models/Task/Task";
import {  NavigationStackProp } from "react-navigation-stack";
import { Single, Child, None } from "App";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { GoalType } from "src/Models/Goal/GoalLogic";
import { ConnectedStreakCycleList } from "src/ConnectedComponents/Lists/Group/StreakCycleList";
import StreakCycleQuery from "src/Models/Group/StreakCycleQuery";
import { switchMap } from "rxjs/operators";
import MyDate from "src/common/Date";



interface Props {
    navigation: NavigationStackProp<Single>
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
            title: 'Goal',
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

        this.unsubscribe = () => {};
    }

    componentDidMount = async () => {
        const id = this.props.navigation.getParam('id', '');
        const goal = await new GoalQuery().get(id); 

        if(goal) {
            this.setState({
                goal: goal
            })

            const activeSub = new TaskQuery().queryActiveHasParent(goal.id).observeCount().subscribe((num) => {
                this.setState({
                    activeCount: num,
                })
            });
            const inactiveSub = new TaskQuery().queryInactiveHasParent(goal.id).observeCount().subscribe((num) => {
                this.setState({
                    inactiveCount: num,
                })
            });

            const currentCycleSub = new StreakCycleQuery().queryInGoal(goal.id).observe().pipe(switchMap(( cycles ) => {
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

            const previousCycleSub = new StreakCycleQuery()
                                                        .queryDueOnBeforeInGoal(goal.id, goal.currentCycleEnd())
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

        dispatcher.addEventListener(getKey(this.props.navigation), this.onClickAdd)
    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.props.navigation), this.onClickAdd)
        this.unsubscribe()
    }

    onClickAdd = () => {
        this.setState({
            showAdd: true,
        })
    }

    onEditGoal = () => {
        const params = {
            id: this.props.navigation.getParam('id', ''),
        };
        this.props.navigation.navigate('AddGoal', params);
    }

    onCompleteGoal = async () => {
        const id = this.props.navigation.getParam("id", "");
        const logic = new GoalLogic(id);
        debugger;
        if( await logic.isStreak() && (! (await logic.metMinimum()))) {
            this.setState({
                toastVisible: true,
                toastMessage: "Goal cannot be completed. Streak minimum has not been met yet.",
            })
        } else {
            void new GoalLogic(id).complete();
        }
    }

    onFailGoal = async () => {
        const id = this.props.navigation.getParam("id", "");
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
            <DocumentView>
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
                                this.props.navigation.push("AddTask", {
                                    parent_id: this.props.navigation.getParam("id", ""),
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
                        navigation={this.props.navigation}
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
            switch(goal.goalType) {
                case GoalType.STREAK: {
                    return (
                        <View
                            style={{
                                flex: 0,
                            }}
                        >
                            <BackgroundTitle title={`Current Cycle (${this.state.currentCycleCount}) starts ${goal.currentCycleStart().toString()} ends ${goal.currentCycleEnd().toString()}`}
                                style={{
                                }}
                            ></BackgroundTitle>

                            <ConnectedTaskList
                                navigation={this.props.navigation}
                                parentId={this.props.navigation.getParam('id', '')}
                                type={"current-cycle"}
                                paginate={4}
                                onSwipeRight={(id: string) => {
                                    this.onTaskAction(id, "complete")
                                }}
                                emptyText={"No active tasks"}
                                onTaskAction={this.onTaskAction}
                            ></ConnectedTaskList>

                            <BackgroundTitle title={`Previous Cycles (${this.state.previousCycleCount})`}
                                style={{
                                }}
                            ></BackgroundTitle>

                            <ConnectedStreakCycleList
                                navigation={this.props.navigation}
                                type={"previous"}
                                goalId={this.props.navigation.getParam('id', '')}
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
                                navigation={this.props.navigation}
                                parentId={this.props.navigation.getParam('id', '')}
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
                                navigation={this.props.navigation}
                                parentId={this.props.navigation.getParam('id', '')}
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