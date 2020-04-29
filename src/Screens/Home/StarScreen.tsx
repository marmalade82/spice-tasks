
import React from "react";
import { View, Text } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView, RowReverseView } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { ScrollView } from "react-native";
import { 
    NavigationRow, ScreenHeader, DocumentView, 
} from "src/Components/Styled/Styled";

import { EventDispatcher } from "src/common/EventDispatcher";
import { MainNavigator, ScreenNavigation, FullNavigation } from "src/common/Navigator";

import AddModal from "./common/AddModal";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { ConnectedGoalList, makeGoalFilterState, GoalFilter, GoalSorter } from "src/ConnectedComponents/Lists/Goal/GoalList";
import { GoalLogic, ActiveGoalQuery } from "src/Models/Goal/GoalQuery";
import { observableWithRefreshTimer } from "src/Models/Global/GlobalQuery";
import SidescrollPicker, { makeChoices } from "src/Components/Styled/SidescrollPicker";


interface Props {
    navigation: object;
}


interface State {
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

    readonly futureGoalFilterState = makeGoalFilterState<GoalFilter, GoalSorter>("all", "start", undefined, "up");
    readonly ongoingGoalFilterState = makeGoalFilterState<GoalFilter, GoalSorter>("all", "start", undefined, "up");
    unsub: () => void;
    navigation: MainNavigator<"AppStart">;
    constructor(props: Props) {
        super(props);
        this.state = {
            showAdd: false,
        }
        this.unsub = () => {}
        this.navigation = new ScreenNavigation(this.props);
    }

    componentDidMount = () => {
        dispatcher.addEventListener(getKey(this.navigation), this.onClickAdd);
        this.unsub = () => {
            dispatcher.removeEventListener(getKey(this.navigation ), this.onClickAdd);
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
        const futureFilters: GoalFilter[] = ["all"]
        const futureSorters: GoalSorter[] = ["start", "due", "title"]
        const ongoingFilters: GoalFilter[] = ["all"]
        const ongoingSorters: GoalSorter[] = ["start", "due", "title"]
        return (
            <DocumentView accessibilityLabel={"star"}>
                <ScrollView>
                    <SidescrollPicker
                        label={`Ongoing Goals`}
                        filters={makeChoices(ongoingFilters)}
                        sorters={makeChoices(ongoingSorters)}
                        localState={this.ongoingGoalFilterState}
                        accessibilityLabel={"ongoing-goal-filter"}
                    ></SidescrollPicker>
                    <ConnectedGoalList
                        navigation={this.navigation}
                        type={"ongoing"}
                        paginate={4}
                        onSwipeRight={(id: string) => {
                            this.onGoalAction(id, "complete")
                        }}
                        onGoalAction={this.onGoalAction}
                        provider={this.ongoingGoalFilterState}
                        parentId={undefined}
                    ></ConnectedGoalList>


                    <SidescrollPicker
                        label={`Future Goals`}
                        filters={makeChoices(futureFilters)}
                        sorters={makeChoices(futureSorters)}
                        localState={this.futureGoalFilterState}
                        accessibilityLabel={"future-goal-filter"}
                    ></SidescrollPicker>
                    <ConnectedGoalList
                        navigation={this.navigation}
                        type={"future"}
                        paginate={4}
                        onGoalAction={this.onGoalAction}
                        emptyText={"You don't have any goals planned"}
                        provider={this.futureGoalFilterState}
                        parentId={undefined}
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