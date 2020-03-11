import React from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import Style from "src/Style/Style";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList"
import { ConnectedGoalSummary } from "src/ConnectedComponents/Summaries/GoalSummary";
import Goal from "src/Models/Goal/Goal";
import GoalQuery, { GoalLogic } from "src/Models/Goal/GoalQuery";
import {
    ColumnView, RowView, Button as MyButton, ViewPicker,
} from "src/Components/Basic/Basic";
import NavigationButton from "src/Components/Navigation/NavigationButton";
import { DocumentView, ScreenHeader, ListPicker, Toast, BackgroundTitle, ModalIconButton, ModalRow, Modal } from "src/Components/Styled/Styled";
import { ScrollView } from "react-native";
import TaskQuery, { TaskLogic } from "src/Models/Task/TaskQuery";
import FootSpacer from "src/Components/Basic/FootSpacer";
import { TaskParentTypes } from "src/Models/Task/Task";
import {  NavigationStackProp } from "react-navigation-stack";
import { Single, Child, None } from "App";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getEventHandlerName } from "@testing-library/react-native";
import { getKey } from "../common/screenUtils";



interface Props {
    navigation: NavigationStackProp<Single>
}

interface State {
    goal?: Goal;
    currentList: number;
    activeCount: number;
    inactiveCount: number;
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
            })
            this.unsubscribe = () => {
                activeSub.unsubscribe();
                inactiveSub.unsubscribe();
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

    render = () => {
        return (
            <DocumentView>
                <ScrollView>
                    {this.renderSummary()}
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

    renderSummary = () => {
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
}