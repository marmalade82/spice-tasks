
import React from "react";
import { ConnectedRecurSummary } from "src/ConnectedComponents/Summaries/RecurSummary";
import Recur from "src/Models/Recurrence/Recur";
import RecurQuery, { RecurLogic } from "src/Models/Recurrence/RecurQuery";
import {
    ColumnView, RowView, Button as MyButton,
    ViewPicker,
} from "src/Components/Basic/Basic";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";
import { MainNavigator, ScreenNavigation } from "src/common/Navigator";


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
        return [
            {   title: "Goals"
            ,   render: () => {
                    return (
                        <ConnectedGoalList
                            navigation={this.navigation}
                            parentId={this.navigation.getParam('id', '')}
                            type={"recurring"}
                            onGoalAction={this.onGoalAction}
                        ></ConnectedGoalList>
                    );
                }
            },
        ]
    }
}