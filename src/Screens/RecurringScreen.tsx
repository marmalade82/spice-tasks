import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Style from "src/Style/Style";
import { RecurringForm } from "src/Components";
import { DocumentView, ScreenHeader } from "src/Components/Styled/Styled";

interface Props {

}

interface State {}

const localStyle = StyleSheet.create({
    container: {
    },
})

export default class RecurringScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Recurring',
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ScreenHeader>
                    Recurring
                </ScreenHeader>
                <RecurringForm
                    data={false}
                    onDataChange={()=>{}}
                ></RecurringForm>
            </DocumentView>
        )
    }
}