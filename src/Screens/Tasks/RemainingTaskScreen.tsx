import React from "react";
import { ColumnView, RowView, RowReverseView, HeaderText } from "src/Components/Basic/Basic";
import { ScreenHeader, DocumentView, ClickRow, ListPicker, ListItem } from "src/Components/Styled/Styled";
import List from "src/Components/Lists/base/List";
import TaskQuery, { TaskLogic } from "src/Models/Task/TaskQuery";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList";

interface Props {
    navigation: any;
}

interface State {
    currentList: number;
    dueSoonTodayCount: number;
    completedTodayCount: number;
    inProgressCount: number;
}

export default class RemainingTaskScreen extends React.Component<Props, State> {
    unsubscribe: () => void;
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Remaining Tasks',
        }
    }
    constructor(props: Props ){
        super(props);

        this.state = {
            currentList: 0,
            dueSoonTodayCount: 0,
            completedTodayCount: 0,
            inProgressCount: 0,
        }
        this.unsubscribe = () => {};
    }

    componentDidMount = () => {
        const dueSoonSub = new TaskQuery().queryActiveAndDueSoonToday().observeCount().subscribe((num) => {
            this.setState({
                dueSoonTodayCount: num
            })
        })

        const completedTodaySub = new TaskQuery().queryCompletedToday().observeCount().subscribe((num) => {
            this.setState({
                completedTodayCount: num
            })
        })

        const inProgressSub = new TaskQuery().queryActiveAndStartedButNotDue().observeCount().subscribe((num) => {
            this.setState({
                inProgressCount: num
            });
        })

        this.unsubscribe = () => {
            dueSoonSub.unsubscribe();
            completedTodaySub.unsubscribe();
            inProgressSub.unsubscribe();
        }
    }

    componentWillUnmount = () => {
        this.unsubscribe();
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

    render = () => {
        return (
            <DocumentView>
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
        );
    }

    renderLists = () => {
        return [
            { selector: {              
                number: this.state.dueSoonTodayCount,
                text: "Due Today",
              },
              list: () => {
                  return (
                    <ConnectedTaskList
                        navigation={this.props.navigation}
                        type={"active-due-soon-today"}
                        parentId={""}
                        onTaskAction={this.onTaskAction}
                    ></ConnectedTaskList>
                  );
              }
            },
            { selector: {
                number: this.state.inProgressCount,
                text: "In Progress",
              },
              list: () => {
                  return (
                      <ConnectedTaskList
                        navigation={this.props.navigation}
                        type={"in-progress-but-not-due-today"}
                        parentId={""}
                        onTaskAction={this.onTaskAction}
                      >
                      </ConnectedTaskList>
                  )
              }
            },
            { selector: {
                number: this.state.completedTodayCount,
                text: "Completed",
              },
              list: () => {
                  return (
                    <ConnectedTaskList
                        navigation={this.props.navigation}
                        type={"completed-today"}
                        parentId={""}
                        onTaskAction={this.onTaskAction}
                    >
                    </ConnectedTaskList>
                  )
              }
            },
        ]
    }
}