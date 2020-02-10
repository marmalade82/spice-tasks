import React from "react";
import { ColumnView } from "src/Components/Basic/Basic";
import { Button } from "react-native";
import { AddPenaltyForm, AddPenaltyData, AddPenaltyDefault } from "src/Components/Forms/AddPenaltyForm";
import { PenaltyQuery, Penalty } from "src/Models/Penalty/PenaltyQuery";
import { DocumentView } from "src/Components/Styled/Styled";
import { ScrollView } from "react-native";



interface Props {
    navigation: any;
}

interface State {
    data: AddPenaltyData;
    penalty?: Penalty;
}


export default class AddPenaltyScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Add Penalty',
        }
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            data: AddPenaltyDefault(),
        }
    }

    componentDidMount = async () => {
        const id = this.props.navigation.getParam('id', '');
        const penalty = await new PenaltyQuery().get(id); 
        if(penalty) {
            let data: AddPenaltyData = {
                name: penalty.title,
                expire_date: penalty.expireDate,
                details: penalty.details,
            }
            this.setState({
                penalty: penalty,
                data: data,
            })
        } else {
            this.setState({
                penalty: undefined
            })
        }
    }

    onSave = () => {
        const data = this.state.data;
        const penaltyData = {
            title: data.name,
            expireDate: data.expire_date,
            details: data.details,
        };

        if(this.state.penalty) {
            (new PenaltyQuery().update(this.state.penalty, penaltyData)).catch();        
        } else {
            new PenaltyQuery().create(penaltyData).catch();
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ScrollView>
                    { this.renderPenaltyForm() }
                </ScrollView>

                <Button
                    title={"SAVE"}
                    onPress={this.onSave}
                    accessibilityLabel={"input-save-button"}
                />
            </DocumentView>
        );
    }

    renderPenaltyForm = () => {
        return (
            <AddPenaltyForm
                data={this.state.data}
                onDataChange={(d: AddPenaltyData) => {
                    this.setState({
                        data: d
                    });
                }}
                style={{}}
            ></AddPenaltyForm>
        );
    }
}