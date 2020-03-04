
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


interface Props {
    navigation: any
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

    constructor(props: Props) {
        super(props);
        this.state = {
            recur: undefined
        }
    }

    componentDidMount = async () => {
        const id = this.props.navigation.getParam('id', '');
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
        const id = this.props.navigation.getParam('id', '');
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
            <DocumentView>
                <ScreenHeader>
                    Recur Summary
                </ScreenHeader>
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
                    navigation={this.props.navigation}
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
                            navigation={this.props.navigation}
                            parentId={this.props.navigation.getParam('id', '')}
                            type={"recurring"}
                            onGoalAction={this.onGoalAction}
                        ></ConnectedGoalList>
                    );
                }
            },
        ]
    }
}