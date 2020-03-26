
import React from "react";
import { View, Text } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView, RowReverseView } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { ScrollView } from "react-native";
import { 
    NavigationRow, ScreenHeader, DocumentView, 
    NavigationGroup, BackgroundTitle, Summary ,
    IconButton, ModalRow, ModalIconButton, Icon, Modal,
} from "src/Components/Styled/Styled";

import { EventDispatcher } from "src/common/EventDispatcher";
import { MainNavigator, ScreenNavigation, FullNavigation } from "src/common/Navigator";

import { BarChart, LineChart }from "src/Components/Charts/Charts";
import AddModal from "./common/AddModal";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";
import { GoalLogic, ActiveGoalQuery } from "src/Models/Goal/GoalQuery";
import { observableWithRefreshTimer } from "src/Models/Global/GlobalQuery";


interface Props {
    navigation: object;
}


interface State {
    ongoingGoalsCount: number;
    futureGoalsCount: number;
    showAdd: boolean
}

const dispatcher = new EventDispatcher();

export default class StarScreen extends React.Component<Props, State> {
    width = 100;
    height = 100;
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Goal Dashboard',
            right: [
                () => { return (
                    <HeaderAddButton
                        dispatcher={dispatcher}
                        eventName={getKey(navigation)}
                    ></HeaderAddButton>
                )}
            ],
        }
    }

    unsub: () => void;
    navigation: MainNavigator<"AppStart">;
    constructor(props: Props) {
        super(props);
        this.state = {
            ongoingGoalsCount: 0,
            futureGoalsCount: 0,
            showAdd: false,
        }
        this.unsub = () => {}
        this.navigation = new ScreenNavigation(this.props);
    }

    componentDidMount = () => {
        let ongoingGoalsSub = observableWithRefreshTimer(
            () => new ActiveGoalQuery().queryStarted().observeCount()).subscribe((count) => {
                this.setState({
                    ongoingGoalsCount: count
                })
            }) ;

        let futureGoalsSub = observableWithRefreshTimer(
            () => new ActiveGoalQuery().queryNotStarted().observeCount()).subscribe((count) => {
                this.setState({
                    futureGoalsCount: count
                })
            });

        dispatcher.addEventListener(getKey(this.navigation), this.onClickAdd);
        this.unsub = () => {
            dispatcher.removeEventListener(getKey(this.navigation ), this.onClickAdd);
            ongoingGoalsSub.unsubscribe();
            futureGoalsSub.unsubscribe();
        }
    }

    onClickAdd = () => {
        this.setState({
            showAdd: true
        })
    }

    componentWillUnmount = () => {
        this.unsub();
    }

    private onGoalAction = (id: string, action: "complete" | "fail") => {
        switch(action) {
            case "complete": {
                void new GoalLogic(id).complete();
            } break;
            case "fail":{
                void new GoalLogic(id).fail();
            } break;
        }
    }

    render = () => {

        return (
            <DocumentView accessibilityLabel={"star"}>
                <ScrollView>
                    <BackgroundTitle title={`Ongoing Goals (${this.state.ongoingGoalsCount})`}
                        style={{
                        }}
                    ></BackgroundTitle>

                    <ConnectedGoalList
                        navigation={this.navigation}
                        type={"ongoing"}
                        paginate={4}
                        onSwipeRight={(id: string) => {
                            this.onGoalAction(id, "complete")
                        }}
                        onGoalAction={this.onGoalAction}
                    ></ConnectedGoalList>


                    <BackgroundTitle title={`Future Goals (${this.state.futureGoalsCount})`}
                        style={{
                        }}
                    ></BackgroundTitle>
                    <ConnectedGoalList
                        navigation={this.navigation}
                        type={"future"}
                        paginate={4}
                        onGoalAction={this.onGoalAction}
                        emptyText={"You don't have any goals planned"}
                    ></ConnectedGoalList>
                </ScrollView>
            

                <AddModal
                    visible={this.state.showAdd}
                    onRequestClose={() => this.setState({ showAdd: false })}
                    navigation={this.navigation}
                ></AddModal>
            </DocumentView>
        );
    }
}