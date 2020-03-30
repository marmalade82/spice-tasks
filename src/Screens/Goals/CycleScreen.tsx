import React from "react";
import { DocumentView } from "src/Components/Styled/Styled";
import { ScreenNavigation, ScreenParams } from "src/common/Navigator";
import StreakCycle from "src/Models/Group/StreakCycle";
import StreakCycleQuery from "src/Models/Group/StreakCycleQuery";
import { ScrollView } from "react-native-gesture-handler";
import FootSpacer from "src/Components/Basic/FootSpacer";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList"
import { TaskLogic } from "src/Models/Task/TaskQuery";
import { SidescrollPicker, LabelValue } from "src/Components/Styled/SidescrollPicker";


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
                    {this.renderLists()}
            </DocumentView>
        )
    }

    private renderSummary = () => {
        return null;
    }

    private renderLists = () => {
        // we render all tasks for the cycle, with a mark about whether or not they've been completed yet.
        let id = this.navigation.getParam("id", "");
        return (
            <ConnectedTaskList
                parentId={id}
                navigation={this.navigation}
                onTaskAction={this.onTaskAction}
                type={"parent"}
                iconIndicates={"completion"}
                onSwipeRight={(id: string) => {
                    this.onTaskAction(id, "complete");
                }}
                withFilters={[
                    "all", "ongoing", "overdue", "complete", "failed"
                ]}
            ></ConnectedTaskList>
        )
    }

}

