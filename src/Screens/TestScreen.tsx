import React from "react";
import { RowView, ColumnView, HeaderText } from "src/Components/Basic/Basic";
import { 
    DocumentView, ScreenHeader, Label, TextInput, 
    MultiLineInput,  DateInput, DynamicChoiceInput,
} from "src/Components/Styled/Styled";
import { StringInput, ChoiceInput, DateTimeInput } from "src/Components/Inputs";
import { 
    LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, Styles, 
    TEXT_VERTICAL_MARGIN, RIGHT_SECOND_MARGIN, TEXT_GREY,
    PLACEHOLDER_GREY,
} from "src/Components/Styled/Styles";
import { ScrollView, DeviceEventEmitter, Button, TextInput as TInput} from "react-native";
import SpiceDBService from "src/Services/DBService";
import TimeQuery from "src/Models/Global/GlobalQuery";
import PushNotification from "src/Notification";
import { Observable } from "rxjs";
import { LabelValue } from "src/common/types";

interface Props {
    navigation: any;
}

interface State {
    text: string;
    choice: string;
    date: Date;
    count: number;
    dynChoice: string;
}


export default class TestScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Test',
        }

    }

    unsub: () => void;
    constructor(props: Props) {
        super(props);

        this.state = {
            text : "Hi",
            choice: "4",
            date: new Date(),
            count: 0,
            dynChoice: "APPLES",
        }
        this.unsub = () => {

        }
    }

    componentDidMount = async () => {
        const time = await new TimeQuery().currentTime();
        SpiceDBService.stopService();
        if(time) {
            const timeSub = time.observe().subscribe((time) => {
                this.setState({
                    count: time.count,
                })
            });

            this.unsub = () => {
                timeSub.unsubscribe();
            }
        }
    }

    componentWillUnmount = () => {

    }

    render = () => {
        let obs: Observable<LabelValue[]> = new Observable((subscriber) => {
            let arr: LabelValue[] = [];
            for(let i = 0; i < 3; i++) {
                arr.push({
                    label: "hi",
                    value: "hi",
                    key: "hi"
                })
            }
            subscriber.next(arr);

            let arr_2: LabelValue[] = [];
            for(let i = 0; i < 15; i++) {
                arr_2.push({
                    label: "bye",
                    value: "bye",
                    key: "bye"
                })
            }

            setTimeout(() => {
                subscriber.next(arr_2);
            }, 10000)
        })
        return (
            <DocumentView>
                <ScreenHeader style={{
                    marginBottom: 60
                }}>{"Test Screen: " + this.state.count.toString()}</ScreenHeader>


                <ScrollView>
                    <TInput
                        value={this.state.text}
                        onChangeText={() => {
                            console.log("SOMEONE CHANGED MY TEXT")
                        }}
                    ></TInput>
                    
                    <Button
                        title="Add Period"
                        onPress={() => {
                            this.setState({
                                text: this.state.text + "."
                            });
                        }}
                    ></Button>

                    <Button
                        title="Start"
                        onPress={() => {
                            PushNotification.localNotification({
                                message: "hi there"
                            })
                        }}
                    ></Button>
                    <Button
                        title="Stop"
                        onPress={() => {
                            SpiceDBService.stopService()
                        }}
                    ></Button>

                    <Label
                        text={"Database Choice"}
                    ></Label>
                    <DynamicChoiceInput
                        value={this.state.dynChoice}
                        choices={obs}
                        onValueChange={(val) => {
                            this.setState({
                                dynChoice: val
                            })
                        }}
                    ></DynamicChoiceInput>

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
                        data={this.state.date}
                        type={"date"}
                        onDataChange={(d: Date) => {
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
