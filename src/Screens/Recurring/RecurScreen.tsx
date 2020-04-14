
import React from "react";
import { ConnectedRecurSummary } from "src/ConnectedComponents/Summaries/RecurSummary";
import Recur from "src/Models/Recurrence/Recur";
import RecurQuery, { RecurLogic } from "src/Models/Recurrence/RecurQuery";
import {
    ColumnView, RowView, Button as MyButton,
    ViewPicker,
} from "src/Components/Basic/Basic";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";
import { ConnectedGoalList, makeGoalFilterState, GoalFilter, GoalSorter } from "src/ConnectedComponents/Lists/Goal/GoalList";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";
import SidescrollPicker, { makeChoices } from "src/Components/Styled/SidescrollPicker";


interface Props {
    navigation: object
}

interface State {
    recur?: Recur;
}


export default class RecurScreen extends React.Component<Props, State> {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Recur',
        }
    }

    readonly recurFilterState = makeGoalFilterState<GoalFilter, GoalSorter>("all", "start", undefined, "up");
    navigation: MainNavigator<"Recur">;
    constructor(props: Props) {
        super(props);
        this.state = {
            recur: undefined
        }
        this.navigation = new ScreenNavigation(props);
    }

    componentDidMount = async () => {
        const id = this.navigation.getParam('id', '');
        const recur = await new RecurQuery().get(id); 

        if(recur) {
            this.setState({
               recur: recur
            })

        } else {
            this.setState({
                recur: undefined
            });
        }
    }

    onModalChoice = (str: "enable" | "disable" | "delete") => {
        const id = this.navigation.getParam('id', '');
        switch(str) {
            case "enable": {
                new RecurLogic(id).enable()
            } break;
            case "disable": {
                new RecurLogic(id).disable()
            } break;
            case "delete": {
                new RecurLogic(id).delete()
            } break;
            default: {
                // DO NOTHING
            }
        }
    }

    onGoalAction = (id: string, action: "complete" | "fail") => {

    }

    render = () => {
        return (
            <DocumentView accessibilityLabel={"recur"}>
                {this.renderSummary()}
                <ColumnView style={{
                    flex: 1,
                }}>
                    <ViewPicker
                        views={[...this.renderRecurLists()]}
                        data={false}
                        onDataChange={() => {}}
                        accessibilityLabel={"recurs"}
                        pickerHeight={60}
                    ></ViewPicker>
                </ColumnView>
            </DocumentView>
        );
    }

    renderSummary = () => {
        if(this.state.recur) {
            return (
                <ConnectedRecurSummary
                    navigation={this.navigation}
                    recur={this.state.recur} 
                    onModalChoice={this.onModalChoice}
                ></ConnectedRecurSummary>
            );
        }
    }

    renderRecurLists = () => {
        const filters: GoalFilter[] = ["all", "ongoing", "not started", "overdue", "complete", "failed"]
        const sorters: GoalSorter[] = ["start", "due", "title"]
        return [
            {   title: "Goals"
            ,   render: () => {
                    return (
                        <React.Fragment>
                            <SidescrollPicker
                                localState={this.recurFilterState}
                                filters={makeChoices(filters)}
                                sorters={makeChoices(sorters)}
                                accessibilityLabel={"goal-filter"}
                            ></SidescrollPicker>
                            <ConnectedGoalList
                                navigation={this.navigation}
                                parentId={this.navigation.getParam('id', '')}
                                type={"recurring"}
                                onGoalAction={this.onGoalAction}
                                provider={this.recurFilterState}
                            ></ConnectedGoalList>
                        </React.Fragment>
                    );
                }
            },
        ]
    }
}