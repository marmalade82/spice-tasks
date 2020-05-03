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
import * as R from "ramda";
import { combineLatest } from "rxjs";
import GoalQuery from "src/Models/Goal/GoalQuery";
import { Text, G, Line } from "react-native-svg";
import { StyleSheetContext } from "src/Components/Styled/StyleSheets";

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

    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
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
            new TaskQuery().queryLastWeeks(8).observe()
        ).pipe(map(([tasks]) => {
            const groupedByWeek: Record<string, Task[]> = R.groupBy(sameWeek, tasks) 
            const countsByWeek = R.map((count) => {
                let date = MyDate.Now().subtract(count, "weeks").startOf("weeks").asStartDate().format("YYYY-MM-DD")
                if(groupedByWeek[date] !== undefined) {
                    return groupedByWeek[date].length;
                }
                return 0;

            }, R.reverse(R.range(0, 8)))

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
                        { label: "8w", render: () => {
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
                    yMin={0}
                    yMax={max === 0 ? 1 : max}
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
        <StyleSheetContext.Consumer>
            { ({Common, Class, Custom}) => (
                <View
                    style={[Class.Card_Container, props.style]}
                >
                    <HeaderText style={{
                        marginBottom: 20
                    }} level={3}
                    >
                        {props.title}
                    </HeaderText>
                    {renderCurrent()}
                    <View
                        style={Class.Card_LabelContainer}
                    >
                        {renderLabels()}
                    </View>
                </View>
            )}
        </StyleSheetContext.Consumer>
    )

    function renderCurrent() {
        if(props.pages[current]) {
            return props.pages[current].render();
        } else {
            return null;
        }
    }

    function renderLabels() { 
        return props.pages.map((page, index) => {
            const { label } = page;
            return (
                <StyleSheetContext.Consumer>
                    {({Common, Custom, Class}) => (
                        <TouchableView key={label} 
                            style={{
                                ...Class.Card_Label,
                                ...( (current !== index && Class.Card_InactiveLabelContainer) || (Class.Card_ActiveLabelContainer) )
                            }}
                            onPress={() => {
                                setCurrent(index)
                            }}
                        >
                            <HeaderText
                                style={{
                                    ...Class.Card_LabelText,
                                    ...( (current !== index && Class.Card_InactiveLabelText) || (Class.Card_ActiveLabelText) )
                                }}
                                level={3}
                            >
                                {label}
                            </HeaderText>
                        </TouchableView>
                    )}
                </StyleSheetContext.Consumer>
            )
        })
    }
}
