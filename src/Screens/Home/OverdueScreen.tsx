
import React from "react";
import { ColumnView, RowView, RowReverseView, HeaderText } from "src/Components/Basic/Basic";
import { ScreenHeader, DocumentView, ClickRow, ListPicker, ListItem } from "src/Components/Styled/Styled";
import List from "src/Components/Lists/base/List";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList";
import TaskQuery from "src/Models/Task/TaskQuery";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";
import GoalQuery from "src/Models/Goal/GoalQuery";


interface Props {
    navigation: any ;
}

interface State {
    currentList: number;
    overdueTasksCount: number;
    overdueGoalsCount: number;
}

/**
 * We can split up what's overdue by type: Task, Goal, Reward, etc.
 * What's nice about this is that I no longer need to group goals and tasks together. I 
 * can present each in a separate list, and let the user decide what to do with them.
*/
export default class OverdueScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Overdue',
        }
    }

    unsubscribe: () => void;
    constructor(props: Props) {
        super(props);

        this.state = {
            currentList: 0,
            overdueTasksCount: 0,
            overdueGoalsCount: 0,
        }
        this.unsubscribe = () => {};
    }

    componentDidMount = () => {
        const taskSub = new TaskQuery().queryActiveAndOverdue().observeCount().subscribe((num) => {
            this.setState({
                overdueTasksCount: num,
            })
        })

        const goalSub = new GoalQuery().queryActiveAndOverdue().observeCount().subscribe((num) => {
            this.setState({
                overdueGoalsCount: num
            })
        })

        this.unsubscribe = () => {
            taskSub.unsubscribe();
            goalSub.unsubscribe();
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ScreenHeader>Overdue</ScreenHeader>

                <ListPicker
                    data={{
                        current: this.state.currentList
                    }}  
                    onDataChange={({ current }) => {
                        this.setState({
                            currentList: current
                        })
                    }}
                    lists={this.renderLists()}
                    layout={"top"}
                >

                </ListPicker>
            </DocumentView>
        )
    }

    renderLists = () => {
        return [
            { selector: {              
                number: this.state.overdueTasksCount,
                text: "Tasks",
              },
              list: () => {
                  return (
                    <ConnectedTaskList
                        navigation={this.props.navigation}
                        type={"overdue"}
                        parentId={""}
                    ></ConnectedTaskList>
                  );
              }
            },
            { selector: {              
                number: this.state.overdueGoalsCount,
                text: "Goals",
              },
              list: () => {
                  return (
                      <ConnectedGoalList
                        navigation={this.props.navigation}
                        type={"overdue"}
                      > </ConnectedGoalList>
                  )
              }
            },
        ];
    }
}