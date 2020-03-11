
import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddRecurForm, AddRecurData, AddRecurDefault } from "src/Components/Forms/AddRecurForm";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { RecurQuery, Recur } from "src/Models/Recurrence/RecurQuery";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderSaveButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";


interface Props {
    navigation: any;
}

interface State { 
    data: AddRecurData;
    recur?: Recur;
}

const dispatcher = new EventDispatcher();

export default class AddRecurScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            data: AddRecurDefault(),
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Recur',
            right: [
                () => {
                    return (
                        <HeaderSaveButton
                            dispatcher={dispatcher}
                            eventName={getKey(navigation)}
                        ></HeaderSaveButton>
                    )
                }
            ]
        }
    }

    componentDidMount = async () => {
        const id = this.props.navigation.getParam('id', '');
        const recur = await new RecurQuery().get(id); 
        if(recur) {
            let data: AddRecurData = {
                repeats: recur.type,
            }
            this.setState({
                recur: recur,
                data: data,
            })
        } else {
            this.setState({
                recur: undefined
            })
        }
        dispatcher.addEventListener(getKey(this.props.navigation), this.onSave)
    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.props.navigation), this.onSave)
    }

    onSave = () => {
        // Parent id only changes if recur does not already have a parent id.
        const data = this.state.data;
        const recurData = {
            type: data.repeats,
        };

        if(this.state.recur) {
            void (new RecurQuery().update(this.state.recur, recurData));
        } else {
            // do nothing. We DO NOT create recurrences from this form.
        }

        this.props.navigation.goBack();
    }

    render = () => {
        return (
            <DocumentView>
                <ScrollView style={{
                    backgroundColor: "transparent",
                }}>
                    { this.renderRecurForm() }
                </ScrollView>
            </DocumentView>
        );
    }

    renderRecurForm = () => {
        return (
                <AddRecurForm
                    data={this.state.data}
                    onDataChange={(d: AddRecurData) => {
                        this.setState({
                            data: d
                        });
                    }}
                    style={{}}
                ></AddRecurForm>
        );
    }
}