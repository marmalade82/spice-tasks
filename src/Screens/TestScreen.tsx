import React from "react";
import { RowView, ColumnView, HeaderText } from "src/Components/Basic/Basic";
import { 
    DocumentView, ScreenHeader, Label, TextInput, 
    MultiLineInput,  DateInput,
} from "src/Components/Styled/Styled";
import { StringInput, ChoiceInput, DateTimeInput } from "src/Components/Inputs";
import { 
    LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, Styles, 
    TEXT_VERTICAL_MARGIN, RIGHT_SECOND_MARGIN, TEXT_GREY,
    PLACEHOLDER_GREY,
} from "src/Components/Styled/Styles";
import { ScrollView } from "react-native";

interface Props {
    navigation: any;
}

interface State {
    text: string;
    choice: string;
    date: Date;
}


export default class TestScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Test',
        }

    }

    constructor(props: Props) {
        super(props);

        this.state = {
            text : "Hi",
            choice: "4",
            date: new Date()
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ScreenHeader style={{
                    marginBottom: 60
                }}>Test Screen</ScreenHeader>

                <ScrollView>
                        <StringInput
                            title={"Age"}
                            value={"WHAT"}
                            placeholder={"hi"}
                            accessibilityLabel={"test-string-input"}
                            onChangeText={() => {}}
                        ></StringInput>

                    <Label
                        text={"Age"}
                    ></Label>
                    <TextInput
                        placeholder={"e.g. 58"}
                        value={"YO"}
                        onChangeText={() => {}}
                        style={{
                            marginBottom: 60,
                        }}
                    ></TextInput>

                    <Label
                        text={"Instructions"}
                    ></Label>
                    <MultiLineInput
                        placeholder={"What to do?"}
                        value={this.state.text}
                        onChangeText={(s) => {
                            this.setState({
                                text: s
                            })
                        }}
                        style={{
                            marginBottom: 60
                        }}
                    >

                    </MultiLineInput>

                    <ChoiceInput
                        title={"Goal Type"}
                        selectedValue={this.state.choice}
                        onValueChange={(val, pos) => {
                            this.setState({
                                choice: val,
                            })
                        }}
                        choices={[
                            { label: "1", value: "1", key: "1"},
                            { label: "2", value: "2", key: "2"},
                            { label: "3", value: "3", key: "3"},
                            { label: "4", value: "4", key: "4"},
                            { label: "4", value: "5", key: "5"},
                            { label: "4", value: "6", key: "6"},
                            { label: "4", value: "7", key: "7"},
                            { label: "4", value: "8", key: "8"},
                            { label: "4", value: "9", key: "9"},
                        ]}
                        accessibilityLabel={"test"}
                        style={{
                            marginBottom: 60
                        }}
                    ></ChoiceInput>
                    
                    <DateTimeInput
                        title={"Starts on"} 
                        value={this.state.date}
                        type={"date"}
                        onValueChange={(d: Date) => {
                            this.setState({
                                date: d
                            })
                        }}
                        accessibilityLabel={"date input"}
                    >

                    </DateTimeInput>

                </ScrollView>


            </DocumentView>
        );
    }

}
