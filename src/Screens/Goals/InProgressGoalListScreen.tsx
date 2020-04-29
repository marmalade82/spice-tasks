
import React from "react";
import { ColumnView, RowView, RowReverseView, HeaderText } from "src/Components/Basic/Basic";
import { ScreenHeader, DocumentView, ClickRow, ListPicker, ListItem } from "src/Components/Styled/Styled";
import List from "src/Components/Lists/base/List";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";
import GoalQuery, { GoalLogic, ActiveGoalQuery } from "src/Models/Goal/GoalQuery";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";


interface Props {
    navigation: object;
}

interface State {
    currentList: number;
}

export default class InProgressGoalListScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Remaining Tasks',
        }
    }

    unsubscribe: () => void;
    navigation: MainNavigator<"InProgressGoals">;
    constructor(props: Props ) {

        super(props);

        this.state = {
            currentList : 0,
        }

        this.unsubscribe = () => {}
        this.navigation = new ScreenNavigation(this.props);
    }

    componentDidMount = () => {

        this.unsubscribe = () => {
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
            <DocumentView accessibilityLabel={"in-progress-goals"}>
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

    private renderLists = () => {
        return [
            { selector: {              
                number: 0,
                text: "Goals",
              },
              list: () => {
                  return (
                      <ConnectedGoalList
                        navigation={this.navigation}
                        type={"in-progress-not-due"}
                        onGoalAction={this.onGoalAction}
                        parentId={undefined}
                      ></ConnectedGoalList>
                  )
              }
            },
        ];
    }
}
