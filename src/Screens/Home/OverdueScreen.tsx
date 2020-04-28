
import React from "react";
import { ColumnView, RowView, RowReverseView, HeaderText } from "src/Components/Basic/Basic";
import { ScreenHeader, DocumentView, ClickRow, ListPicker, ListItem } from "src/Components/Styled/Styled";
import List from "src/Components/Lists/base/List";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList";
import TaskQuery, { TaskLogic, ActiveTaskQuery } from "src/Models/Task/TaskQuery";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";
import GoalQuery, { GoalLogic, ActiveGoalQuery } from "src/Models/Goal/GoalQuery";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";


interface Props {
    navigation: object ;
}

interface State {
    currentList: number;
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
    navigation: MainNavigator<"Overdue">
    constructor(props: Props) {
        super(props);

        this.state = {
            currentList: 0,
        }
        this.unsubscribe = () => {};
        this.navigation = new ScreenNavigation(this.props);
    }

    componentDidMount = () => {

        this.unsubscribe = () => {
        }
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
                new GoalLogic(id).complete();
            } break;
            case "fail" : {
                new GoalLogic(id).fail();
            } break;
        }
    }

    render = () => {
        return (
            <DocumentView accessibilityLabel={"overdue"}>

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
                number: 0,
                text: "Tasks",
              },
              list: () => {
                  return (
                    <ConnectedTaskList
                        navigation={this.navigation}
                        type={"overdue"}
                        parentId={""}
                        onTaskAction={this.onTaskAction}
                    ></ConnectedTaskList>
                  );
              }
            },
            { selector: {              
                number: 0,
                text: "Goals",
              },
              list: () => {
                  return (
                      <ConnectedGoalList
                        navigation={this.navigation}
                        type={"overdue"}
                        onGoalAction={this.onGoalAction}
                      > </ConnectedGoalList>
                  )
              }
            },
        ];
    }
}