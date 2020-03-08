import React from "react";
import { ColumnView } from "src/Components/Basic/Basic";
import { Button } from "react-native";
import { AddPenaltyForm, AddPenaltyData, AddPenaltyDefault, ValidatePenaltyForm } from "src/Components/Forms/AddPenaltyForm";
import { PenaltyQuery, Penalty } from "src/Models/Penalty/PenaltyQuery";
import { DocumentView, Toast } from "src/Components/Styled/Styled";
import { ScrollView } from "react-native";
import SaveButton from "src/Components/Basic/SaveButton";



interface Props {
    navigation: any;
}

interface State {
    data: AddPenaltyData;
    penalty?: Penalty;
    toast: string;
    showToast: boolean;
}


export default class AddPenaltyScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Add Penalty',
        }
    }

    penaltyFormRef: React.RefObject<AddPenaltyForm>
    constructor(props: Props) {
        super(props);
        this.state = {
            data: AddPenaltyDefault(),
            toast: "",
            showToast: false,
        }

        this.penaltyFormRef = React.createRef();
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
        let message : string | undefined = undefined;
        if(this.penaltyFormRef.current) {
            message = ValidatePenaltyForm(this.penaltyFormRef.current);
        }
        
        if(message !== undefined) {
            this.setState({
                toast: message,
                showToast: true,
            })
        } else {
            const data = this.state.data;
            const penaltyData = {
                title: data.name,
                expireDate: data.expire_date,
                details: data.details,
            };

            if(this.state.penalty) {
                void (new PenaltyQuery().update(this.state.penalty, penaltyData)).catch();        
            } else {
                void new PenaltyQuery().create(penaltyData).catch();
            }

            this.props.navigation.goBack();
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ScrollView>
                    { this.renderPenaltyForm() }
                </ScrollView>
                <SaveButton
                    onSave={this.onSave}
                ></SaveButton>
                <Toast
                    visible={this.state.showToast}
                    message={this.state.toast}
                    onToastDisplay={() => {
                        this.setState({
                            showToast: false,
                        })
                    }}
                ></Toast>
            </DocumentView>
        );
    }

    renderPenaltyForm = () => {
        return (
            <AddPenaltyForm
                ref={this.penaltyFormRef}
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