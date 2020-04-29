import React from "react";
import { DocumentView } from "src/Components/Styled/Styled";
import { ScreenNavigation, ScreenParams } from "src/common/Navigator";
import StreakCycle from "src/Models/Group/StreakCycle";
import StreakCycleQuery from "src/Models/Group/StreakCycleQuery";
import { ScrollView } from "react-native-gesture-handler";
import FootSpacer from "src/Components/Basic/FootSpacer";
import { ConnectedTaskList, TaskFilter, TaskSorter, makeTaskLocalState } from "src/ConnectedComponents/Lists/Task/TaskList"
import { TaskLogic } from "src/Models/Task/TaskQuery";
import { SidescrollPicker, LabelValue, makeChoices } from "src/Components/Styled/SidescrollPicker";
import { Button, View } from "react-native";
import { LocalState } from "../common/StateProvider";


interface Props {
    navigation: object;
}

interface State {
    cycle?: StreakCycle;
    current: string;
}


export default class CycleScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: "Habit Tasks"
        }
    }

    readonly taskFilterState = makeTaskLocalState<TaskFilter, TaskSorter>("all", "start", undefined, "up");
    unsubscribe : () => void;
    navigation: ScreenNavigation<ScreenParams, "StreakCycle">
    constructor(props: Props) {
        super(props);

        this.state = {
            cycle: undefined,
            current: "first"
        }

        this.unsubscribe = () => {}
        this.navigation = new ScreenNavigation(this.props);
    }

    componentDidMount = async () => {
        let id = this.navigation.getParam("id", "");
        let cycle = await new StreakCycleQuery().get(id);
        if(cycle) {
            this.setState({
                cycle: cycle
            })
        } else {
            this.setState({
                cycle: undefined
            })
        }
    }


    componentWillUnmount = () => {
        this.unsubscribe();
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
            <DocumentView accessibilityLabel={"cycle-screen"}>
                    {this.renderSummary()}
                    {this.renderFilter()}
                    {this.renderLists()}
            </DocumentView>
        )
    }

    private renderSummary = () => {
        return null;
    }

    private renderFilter = () => {
        const filters: TaskFilter[] = [
            "all", "ongoing", "not started", "overdue", "complete", "failed",
        ]
        const sorters: TaskSorter[] = [
            "start", "title",
        ]

        return (
            <SidescrollPicker
                filters={makeChoices(filters)}
                sorters={makeChoices(sorters)}
                accessibilityLabel={"task-filter"}
                localState={this.taskFilterState}
            ></SidescrollPicker>
        )
    }

    private renderLists = () => {
        // we render all tasks for the cycle, with a mark about whether or not they've been completed yet.
        let id = this.navigation.getParam("id", "");
        return (
            <ConnectedTaskList
                navigation={this.navigation}
                onTaskAction={this.onTaskAction}
                iconIndicates={"completion"}
                onSwipeRight={(id: string) => {
                    this.onTaskAction(id, "complete");
                }}
                provider={this.taskFilterState}
                parentId={id}
                type={"parent"}
                id={undefined}
            ></ConnectedTaskList>
        )
    }

}

