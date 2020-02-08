import React from "react";
import { RowView, ColumnView, HeaderText } from "src/Components/Basic/Basic";
import { DocumentView, ScreenHeader, Label, TextInput } from "src/Components/Styled/Styled";
import { StringInput } from "src/Components/Inputs";
import { 
    LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, Styles, 
    TEXT_VERTICAL_MARGIN, RIGHT_SECOND_MARGIN, TEXT_GREY,
    PLACEHOLDER_GREY,
} from "src/Components/Styled/Styles";

interface Props {
    navigation: any;
}

interface State {}


export default class TestScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Test',
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ScreenHeader style={{
                    marginBottom: 60
                }}>Test Screen</ScreenHeader>

                <RowView style={{
                    flex: 0,
                    height: 60,
                    backgroundColor: "transparent",
                }}>
                    <StringInput
                        title={"Age"}
                        value={"WHAT"}
                        placeholder={"hi"}
                        accessibilityLabel={"test-string-input"}
                        onChangeText={() => {}}
                    ></StringInput>
                </RowView>

                <Label
                    text={"Age"}
                ></Label>
                <TextInput
                    placeholder={"e.g. 58"}
                    value={"YO"}
                    onChangeText={() => {}}
                ></TextInput>

            </DocumentView>
        );
    }

}
