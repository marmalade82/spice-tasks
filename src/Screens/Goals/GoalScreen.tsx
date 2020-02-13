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
import { DocumentView, ScreenHeader, ListPicker } from "src/Components/Styled/Styled";
import { ScrollView } from "react-native-gesture-handler";
import TaskQuery from "src/Models/Task/TaskQuery";


interface Props {
    navigation: any
}

interface State {
    goal?: Goal;
    currentList: number;
    activeCount: number;
    inactiveCount: number;
}

export default class GoalScreen extends React.Component<Props, State> {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Goal',
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

    }

    componentWillUnmount = () => {
        this.unsubscribe()
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
            // SHOW SOME SORT OF ERROR TOAST HERE
        } else {
            new GoalLogic(id).complete();
        }
    }

    onFailGoal = () => {
        const id = this.props.navigation.getParam("id", "");
        new GoalLogic(id).fail();
    }

    onModalChoice = (s: "complete" | "delete" | "incomplete") => {
        switch(s) {
            case "complete": {
                this.onCompleteGoal();
            } break;
            case "incomplete": {
                this.onFailGoal();
            }
            default: {

            }
        }

    }

    render = () => {
        return (
            <DocumentView>
                <ScreenHeader>Goal Summary</ScreenHeader>
                {this.renderSummary()}
                <ListPicker
                    data={{
                        current: this.state.currentList
                    }}
                    onDataChange={({ current }) => {
                        this.setState({
                            currentList: current
                        })
                    }}
                    lists={this.renderTaskLists()}
                    layout={"top"}
                    key="list"
                >

                </ListPicker>
            </DocumentView>
        );
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

    renderTaskLists = () => {
        return [
            {   selector: {
                    number: this.state.activeCount,
                    text: "Active",
                }
            ,   list: () => {
                    return (
                        <ConnectedTaskList
                            navigation={this.props.navigation}
                            parentId={this.props.navigation.getParam('id', '')}
                            type={"parent-active"}
                        ></ConnectedTaskList>
                    );
                }
            },
            {   selector: {
                    number: this.state.inactiveCount,
                    text: "Inactive"
                }
            ,   list: () => {
                    return (
                        <ConnectedTaskList
                            navigation={this.props.navigation}
                            parentId={this.props.navigation.getParam('id', '')}
                            type={"parent-inactive"}
                        ></ConnectedTaskList>
                    );
                }
            }
        ]
    }
}