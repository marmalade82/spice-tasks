import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView, RowReverseView } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { ScrollView } from "react-native";
import { 
    NavigationRow, ScreenHeader, DocumentView, Label, 
} from "src/Components/Styled/Styled";

import FootSpacer from "src/Components/Basic/FootSpacer";
import { MainNavigator, ScreenNavigation, FullNavigation } from "src/common/Navigator";

import { BarChart, ProgressCircle, LineChart, YAxis, Grid } from "react-native-svg-charts";
import TaskQuery, { Task } from "src/Models/Task/TaskQuery";
import { map } from "rxjs/operators";
import moment from "moment";
import { randomNormal } from "d3";
import * as R from "ramda";
import { combineLatest } from "rxjs";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { Text, G, Line } from "react-native-svg";
import { BACKGROUND_GREY, TAB_GREY } from "src/Components/Styled/Styles";

interface Props {
    navigation: object;
}


interface State {
    taskLastWeek: number;
    taskLastMonth: number;

    goalLastWeek: number;
    goalLastMonth: number;

    taskUtilizationWeek: number[];
    taskUtilizationMonth: number[];
}


export default class ReportsScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Productivity',
            right: [
            ],
        }
    }

    unsub: () => void;
    navigation: MainNavigator<"Reports">;
    constructor(props: Props) {
        super(props);
        this.state = {
            taskLastWeek: 0,
            taskLastMonth: 0,

            goalLastWeek: 0,
            goalLastMonth: 0,

            taskUtilizationWeek: [],
            taskUtilizationMonth: [],
        }
        this.unsub = () => {}
        this.navigation = new ScreenNavigation(this.props);
    }

    componentDidMount = async () => {
        // We subscribe to the complete count also, so that when a task is completed, the chart rerenders.
        let sevenDaysSub = combineLatest(
            new TaskQuery().queryLastDaysComplete(7).observeCount(),
            new TaskQuery().queryLastDays(7).observeCount(),
        ).pipe(map(([complete, total]) => {
            return total === 0 ? 1 : complete / total
        })).subscribe((val: number) => {
            this.setState({
                taskLastWeek: val
            })
        })

        const lastMonthTaskSub = combineLatest(
            new TaskQuery().queryLastMonthsComplete(1).observeCount(),
            new TaskQuery().queryLastMonths(1).observeCount(),
        ).pipe(map(([complete, total]) => {
            return total === 0 ? 1 : complete / total;
        })).subscribe((percentage: number) => {
            this.setState({
                taskLastMonth: percentage,
            })
        })

        const lastWeekGoalSub = combineLatest(
            new GoalQuery().queryLastDaysComplete(7).observeCount(),
            new GoalQuery().queryLastDays(7).observeCount()
        ).pipe(map(([complete, total]) => {
            return total === 0 ? 1 : complete / total;
        })).subscribe((percent) => {
            this.setState({
                goalLastWeek: percent
            })
        })

        const lastMonthGoalSub = combineLatest(
            new GoalQuery().queryLastMonthsComplete(1).observeCount(),
            new GoalQuery().queryLastMonths(1).observeCount(),
        ).pipe(map(([complete, total]) => {
            return total === 0 ? 1 : complete / total;
        })).subscribe((percentage: number) => {
            this.setState({
                goalLastMonth: percentage,
            })
        })

        const utilWeekTaskSub = combineLatest(
            new TaskQuery().queryLastDays(14).observe()
        ).pipe(map(([tasks]) => {
            const groupedByDate = R.groupBy(sameDay, tasks)
            const counted = R.mapObjIndexed((tasks) => {
                return tasks.length;
            }, groupedByDate)

            const countsByDay = R.map((count) => {
                let date = MyDate.Now().subtract(count, "days").asStartDate().format("YYYY-MM-DD");
                if(counted[date] !== undefined) {
                    return counted[date];
                }

                return 0;
            }, R.reverse(R.range(0, 14)))

            return countsByDay;

            function sameDay(task: Task) {
                return new MyDate(task.dueDate).asStartDate().format("YYYY-MM-DD");
            }
        })).subscribe((counts) => {
            this.setState({
                taskUtilizationWeek: counts,
            })
        })

        const utilMonthTaskSub = combineLatest(
            new TaskQuery().queryLastWeeks(7).observe()
        ).pipe(map(([tasks]) => {
            const groupedByWeek: Record<string, Task[]> = R.groupBy(sameWeek, tasks) 
            const countsByWeek = R.map((count) => {
                let date = MyDate.Now().subtract(count, "weeks").startOf("weeks").asStartDate().format("YYYY-MM-DD")
                if(groupedByWeek[date] !== undefined) {
                    return groupedByWeek[date].length;
                }
                return 0;

            }, R.reverse(R.range(0, 7)))

            return countsByWeek;

            function sameWeek(task: Task) {
                return new MyDate(task.dueDate).startOf("weeks").asStartDate().format("YYYY-MM-DD")
            }
        })).subscribe((counts) => {
            this.setState({
                taskUtilizationMonth: counts,
            })
        })

        this.unsub = () => {
            sevenDaysSub.unsubscribe();
            lastMonthTaskSub.unsubscribe();
            lastWeekGoalSub.unsubscribe();
            lastMonthGoalSub.unsubscribe();

            utilWeekTaskSub.unsubscribe();
            utilMonthTaskSub.unsubscribe();
        }
    }

    componentWillUnmount = () => {
        this.unsub();
    }

    render = () => {
        /**
         * Possibly have image in place of reports while data is loading.
         */
        return (
            <DocumentView accessibilityLabel={"reports"}>
                <ScrollView>
                    {this.renderCharts()}
                    <FootSpacer></FootSpacer>
                </ScrollView>
            </DocumentView>
        );

    }

    private renderCharts = () => {
        return (
            <React.Fragment>
                <Card
                    style={{
                        marginBottom: 20,
                    }}
                    title={"Task Completion"}
                    pages = {[
                        { label: "1w", render: () => {
                           return this.renderProgress(this.state.taskLastWeek)
                        }},
                        { label: "1m", render: () => {
                            return this.renderProgress(this.state.taskLastMonth, "green");
                        }}
                    ]}
                ></Card>
                <Card
                    style={{
                        marginBottom: 20,
                    }}
                    title={"Goal Completion"}
                    pages = {[
                        { label: "1w", render: () => {
                           return this.renderProgress(this.state.goalLastWeek)
                        }},
                        { label: "1m", render: () => {
                            return this.renderProgress(this.state.goalLastMonth, "green");
                        }}
                    ]}
                ></Card>
                <Card
                    style={{
                        marginBottom: 20,
                    }}
                    title={"Tasks Over Time"}
                    pages = {[
                        { label: "14d", render: () => {
                            return this.renderLine(this.state.taskUtilizationWeek)
                        }},
                        { label: "7w", render: () => {
                            return this.renderLine(this.state.taskUtilizationMonth, "green")
                        }}
                    ]}
                ></Card>
            </React.Fragment> 
        )
    }

    private renderProgress = (n: number, color?: string) => {
        const def = "darkblue";
        return (
            <ProgressCircle 
                style={{ height: 120 }} 
                progress={n} 
                progressColor={color ? color : def} 
                strokeWidth={15}
                cornerRadius={45}
            >
                {this.renderPercent(n, color ? color : def)}
            </ProgressCircle>
        )
    }

    private renderPercent = (n: number, color: string) => {
        const fontSize = 30
        return (
            <Text
                fill={color}
                stroke={color}
                fontSize={fontSize}
                fontWeight="normal"
                x="0"
                y={fontSize / 3}
                textAnchor="middle"
            >
                {percent(n)}
            </Text>
        )
        function percent(n: number) {
            return Math.round(n * 100).toString();
        }
    }

    private renderLine = (counts: number[], color?: string) => {
        const def = "darkblue";
        const contentInset ={ top: 0, bottom: 10, left: 0, right: 0 };

        const max = R.sort((a, b) => b - a, counts)[0];
        
        return (
            <View
                style={{
                    flexDirection: "row-reverse",
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                    backgroundColor: "transparent",
                    flexWrap: "nowrap",
                    zIndex: -1000,
                }}
            >
                <LineChart
                    style={{ width: "100%", height: 200 }}
                    data={counts}
                    min={0}
                    numberOfTicks={20}
                    svg={{ 
                        stroke: color? color : def ,
                        strokeWidth: 3,
                    }}
                    contentInset={contentInset}
                >
                </LineChart>
            </View>
        )

    }
}

interface CardProps {
    style: StyleProp<ViewStyle>;
    pages: ({ label: string, render: () => JSX.Element})[];
    title: string;
}

function Card(props: CardProps) {
    const [current, setCurrent] = React.useState(0);

    return (
        <View
            style={[{
                backgroundColor: "white",
                margin: 15,
                elevation: 10,
                padding: 10,
            }, props.style]}
        >
            <HeaderText style={{
                marginBottom: 20
            }} level={3}
            >
                {props.title}
            </HeaderText>
            {renderCurrent()}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                    height: 40,
                    marginTop: 10,
                }}
            >
                {renderLabels()}
            </View>
        </View>
    )

    function renderCurrent() {
        if(props.pages[current]) {
            return props.pages[current].render();
        } else {
            return null;
        }
    }

    function renderLabels() { 
        const active = TAB_GREY;
        const inactive = "white";

        return props.pages.map((page, index) => {
            const { label } = page;
            return (
                <TouchableView key={label} 
                    style={{
                        padding: 3,
                        paddingHorizontal: 10,
                        borderRadius: 5,
                        marginRight: 3,
                        backgroundColor: current === index ? active : inactive,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={() => {
                        setCurrent(index)
                    }}
                >
                    <HeaderText
                        style={{
                            color: current === index ? inactive : active,
                            fontSize: 15,
                        }}
                        level={3}
                    >
                        {label}
                    </HeaderText>
                </TouchableView>
            )
        })
    }
}

const CustomGrid = ({ x, y, data, ticks }) => (
    <G>
        {
            // Horizontal grid
            ticks.map(tick => (
                <Line
                    key={ tick }
                    x1={ '0%' }
                    x2={ '100%' }
                    y1={ y(tick) }
                    y2={ y(tick) }
                    stroke={ 'rgba(0,0,0,0.2)' }
                />
            ))
        }
    </G>
)