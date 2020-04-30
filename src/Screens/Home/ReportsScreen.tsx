import React from "react";
import { View, Text } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView, RowReverseView } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { ScrollView } from "react-native";
import { 
    NavigationRow, ScreenHeader, DocumentView, Label, 
} from "src/Components/Styled/Styled";

import FootSpacer from "src/Components/Basic/FootSpacer";
import { MainNavigator, ScreenNavigation, FullNavigation } from "src/common/Navigator";

import { BarChart } from "react-native-svg-charts";
import TaskQuery, { Task } from "src/Models/Task/TaskQuery";
import { map } from "rxjs/operators";
import moment from "moment";
import { randomNormal } from "d3";
import * as R from "ramda";
import { combineLatest } from "rxjs";

interface Props {
    navigation: object;
}


interface State {
    lastSevenDays: number[];
}


export default class ReportsScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Reports',
            right: [
            ],
        }
    }

    unsub: () => void;
    navigation: MainNavigator<"Reports">;
    constructor(props: Props) {
        super(props);
        this.state = {
            lastSevenDays: [],
        }
        this.unsub = () => {}
        this.navigation = new ScreenNavigation(this.props);
    }

    componentDidMount = async () => {
        const sdCompleteCount = new TaskQuery().queryLastDaysComplete(7).observeCount();
        const sdAll = new TaskQuery().queryLastDays(7).observe();

        // We subscribe to the complete count also, so that when a task is completed, the chart rerenders.
        let sevenDaysSub = combineLatest(sdCompleteCount, sdAll).pipe(map(([_count, tasks]) => {
            // We map all the tasks to group them by date, calculate percentages, and then sort by date for the chart
            const grouped = R.groupBy(sameDay, tasks)
            const percents = R.mapObjIndexed(percentByDate, grouped)

            let dateStrings = R.map((n) => {
                return MyDate.Now().subtract(n, "days").format("YYYY-MM-DD");
            },  R.range(0, 7))

            let unsortedData = R.map((date) => {
                if(percents[date] !== undefined) {
                    return percents[date]
                }

                return {
                    date: moment(date, "YYYY-MM-DD").toDate(),
                    percentComplete: 100,
                }
            }, dateStrings)

            let sortedData = R.sort((a, b) => {
                return a.date.valueOf() - b.date.valueOf();
            }, unsortedData);
                    

            return R.map((val) => val.percentComplete, sortedData);
        })).subscribe((vals) => {
            this.setState({
                lastSevenDays: vals
            })
        })

        function sameDay(task: Task) {
            return new MyDate(task.startDate).asStartDate().format("YYYY-MM-DD");
        }

        function percentByDate(tasks: Task[], key: string) {
            const completed = R.filter((task: Task) => {
                return task.state === "complete";
            }, tasks)

            return {
                date: moment(key, "YYYY-MM-DD").toDate(),
                percentComplete: 100 * completed.length / tasks.length,
            }
        }

        this.unsub = () => {
            sevenDaysSub.unsubscribe()
        }
    }

    componentWillUnmount = () => {
        this.unsub();
    }

    render = () => {
        const fill = 'rgb(134, 65, 244)'
        return (
            <DocumentView accessibilityLabel={"reports"}>
                <Label text={"Previous 7 Days"}></Label>
                <BarChart
                    style={{height: 200}}
                    svg={{ fill }}
                    data={this.state.lastSevenDays}
                    yMin={0}
                    yMax={100}
                ></BarChart>
                <ScrollView>

                    <FootSpacer></FootSpacer>
                </ScrollView>
            </DocumentView>
        );
    }
}
