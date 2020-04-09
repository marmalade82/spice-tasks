
import React from "react";
import { View, ScrollView, SafeAreaView, Button, Text } from "react-native";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { ConnectedTaskList, Filter, Sorter } from "src/ConnectedComponents/Lists/Task/TaskList";
import { DocumentView } from "src/Components/Styled/Styled";
import { TaskLogic } from "src/Models/Task/TaskQuery";
import { EventDispatcher } from "src/common/EventDispatcher";
import { getKey } from "src/Screens/common/screenUtils";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";
import { TaskParentTypes } from "src/Models/Task/Task";
import SidescrollPicker, {makeChoices} from "src/Components/Styled/SidescrollPicker";
import { ILocalState, LocalState } from "../common/StateProvider";

interface Props {
    navigation: object;
}

interface State { 
}

const dispatcher = new EventDispatcher();

export default class TaskListScreen extends React.Component<Props, State> {
    readonly filterState: LocalState<{ filter: Filter, range: undefined | [Date, Date], direction: "up" | "down", sorter: Sorter }>
    navigation: MainNavigator<"Tasks">
    constructor(props: Props) {
        super(props);
        this.state = {
        }
        this.filterState = this.initialFilter(),
        this.navigation = new ScreenNavigation(props);
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Task List',
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

    initialFilter = () => {
        return new LocalState({
            filter: "all",
            range: undefined,
            direction: "up",
            sorter: "start"
        } as const);
    }

    componentDidMount = () => {
        dispatcher.addEventListener(getKey(this.navigation), this.onClickAdd)
    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.navigation), this.onClickAdd)
    }

    onClickAdd = () => {
        const params = {
            id: "",
            parent_id: "",
            parent_type: TaskParentTypes.NONE,
        };
        this.navigation.navigate('AddTask', params);
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
            <DocumentView accessibilityLabel={"tasks"}>
                {this.renderFilter()}
                <ConnectedTaskList
                    navigation={this.navigation}
                    parentId={""}
                    type={"all"}
                    onTaskAction={this.onTaskAction}
                    provider={this.filterState}
                ></ConnectedTaskList>
            </DocumentView>
        );
    }


    private renderFilter = () => {
        const filters: Filter[] = [
            "all", "ongoing", "not started", "overdue", "complete", "failed"
        ]
        const sorters: Sorter[] = [
            "start", "title"
        ]
        return (
            <SidescrollPicker
                filters={
                    makeChoices<Filter>(filters)
                }
                sorters={
                    makeChoices<Sorter>(sorters)
                }
                localState={this.filterState}
                accessibilityLabel={"tasks-filter"}
            ></SidescrollPicker>
        );
    }
}