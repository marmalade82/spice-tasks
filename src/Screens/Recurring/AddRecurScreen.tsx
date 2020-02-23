
import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import { AddRecurForm, AddRecurData, AddRecurDefault } from "src/Components/Forms/AddRecurForm";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { RecurQuery, Recur } from "src/Models/Recurrence/RecurQuery";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";


interface Props {
    navigation: any;
}

interface State { 
    data: AddRecurData;
    recur?: Recur;
}

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
                <ScreenHeader>Add/Edit Recur</ScreenHeader>
                <ScrollView style={{
                    backgroundColor: "transparent",
                }}>
                    { this.renderRecurForm() }
                </ScrollView>

                    <Button
                        title={"SAVE"}
                        onPress={this.onSave}
                    />
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