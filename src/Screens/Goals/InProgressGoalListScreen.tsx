
import React from "react";
import { ColumnView, RowView, RowReverseView, HeaderText } from "src/Components/Basic/Basic";
import { ScreenHeader, DocumentView, ClickRow, ListPicker, ListItem } from "src/Components/Styled/Styled";
import List from "src/Components/Lists/base/List";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";
import GoalQuery, { GoalLogic, ActiveGoalQuery } from "src/Models/Goal/GoalQuery";


interface Props {
    navigation: any;
}

interface State {
    currentList: number;
    inProgressGoalsCount: number;
}

export default class InProgressGoalListScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Remaining Tasks',
        }
    }

    unsubscribe: () => void;
    constructor(props: Props ) {

        super(props);

        this.state = {
            currentList : 0,
            inProgressGoalsCount: 0,
        }

        this.unsubscribe = () => {}
    }

    componentDidMount = () => {
        const inProgressSub = new ActiveGoalQuery().queryStartedButNotDue().observeCount().subscribe((num) => {
            this.setState({
                inProgressGoalsCount: num
            })
        })

        this.unsubscribe = () => {
            inProgressSub.unsubscribe();
        }
    }

    componentWillUnmount = () => {
        this.unsubscribe();
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
        )
    }

    renderLists = () => {
        return [
            { selector: {              
                number: this.state.inProgressGoalsCount,
                text: "Goals",
              },
              list: () => {
                  return (
                      <ConnectedGoalList
                        navigation={this.props.navigation}
                        type={"in-progress-not-due"}
                        onGoalAction={this.onGoalAction}
                      ></ConnectedGoalList>
                  )
              }
            },
        ];
    }
}
