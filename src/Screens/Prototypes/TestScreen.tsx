import React from "react";
import { RowView, ColumnView, HeaderText } from "src/Components/Basic/Basic";
import { 
    DocumentView, ScreenHeader, Label, TextInput, 
    MultiLineInput,  DateInput, DynamicChoiceInput,
    PagedList,
} from "src/Components/Styled/Styled";
import { StringInput, ChoiceInput, DateTimeInput } from "src/Components/Inputs";
import { ScrollView, DeviceEventEmitter, Button, Text, TextInput as TInput, View, Animated} from "react-native";
import SpiceDBService from "src/Services/DBService";
import GlobalQuery from "src/Models/Global/GlobalQuery";
import PushNotification from "src/Notification";
import { Observable } from "rxjs";
import { LabelValue } from "src/common/types";
import Swipeable from "react-native-gesture-handler/Swipeable";
import MyDate from "src/common/Date";

export let countOfThings = (() => {
    let count = 0;
    return () => {
        count += 1;
    }
})();


interface Props {
    navigation: object;
}

interface State {
    text: string;
    choice: string;
    date: Date;
    count: number;
    dynChoice: string;
}

const things = [
    { first: "Jam", last: "Spedie" },
    { first: "Jam", last: "Spedie" },
    { first: "Jam", last: "Spedie" },
    { first: "Jam", last: "Spedie" },
    { first: "Jam", last: "Spedie" },
    { first: "Jam", last: "Spedie" },
    { first: "Jam", last: "Spedie" },
    { first: "Jam2", last: "Spedie" },
    { first: "Jam2", last: "Spedie" },
    { first: "Jam2", last: "Spedie" },
    { first: "Jam2", last: "Spedie" },
    { first: "Jam2", last: "Spedie" },
    { first: "Jam2", last: "Spedie" },
    { first: "Jam2", last: "Spedie" },
    { first: "Jam2", last: "Spedie" },
    { first: "Jam2", last: "Spedie" },
]

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
            date: MyDate.Now().toDate(),
            count: 0,
            dynChoice: "APPLES",
        }
        this.unsub = () => {

        }
    }

    componentDidMount = async () => {
        const time = await new GlobalQuery().current();
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
            <DocumentView accessibilityLabel={"test"}>
                <ScrollView>
                    <TInput
                        value={this.state.text}
                        onChangeText={() => {
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



                </ScrollView>


            </DocumentView>
        );
    }

}
