
import React from "react";
import { View, Text } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView, RowReverseView } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { ScrollView } from "react-native";
import { 
    NavigationRow, ScreenHeader, DocumentView, 
    NavigationGroup, BackgroundTitle, Summary ,
    IconButton, ModalRow, ModalIconButton,
} from "src/Components/Styled/Styled";

import { 
    CONTAINER_VERTICAL_MARGIN, ROW_CONTAINER_HEIGHT, Styles, 
    LEFT_SECOND_MARGIN, PRIMARY_COLOR_LIGHT, LEFT_FIRST_MARGIN, ICON_CONTAINER_WIDTH, RIGHT_SECOND_MARGIN, ROW_HEIGHT
} from "src/Components/Styled/Styles";
import withObservables from "@nozbe/with-observables";
import GoalQuery from "src/Models/Goal/GoalQuery";
import TaskQuery from "src/Models/Task/TaskQuery";
import EarnedRewardQuery from "src/Models/Reward/EarnedRewardQuery";
import EarnedPenaltyLogic from "src/Models/Penalty/EarnedPenaltyLogic";
import { Schedule } from "Schedule";
import TimeQuery, { TimeLogic, Global_Timer, observableWithRefreshTimer } from "src/Models/Global/GlobalQuery";
import { Subscription } from "rxjs";
import EarnedPenaltyQuery from "src/Models/Penalty/EarnedPenaltyQuery";

interface Props {
    navigation: any;
}


interface State {
    currentDate: Date,
    showMore: boolean;
    showAdd: boolean;
}

export default class AppStartScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'App Start!',
        }
    }

    unsub: () => void;
    constructor(props: Props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            showMore: false,
            showAdd: false,
        }
        this.unsub = () => {}
    }

    componentDidMount = async () => {
        let timeSub: Subscription = Global_Timer.subscribe(() => {
            this.setState({
                currentDate: new Date()
            })
        });

        this.unsub = () => {
            timeSub.unsubscribe();
        }
    }

    componentWillUnmount = () => {
        this.unsub();
    }

    render = () => {
        return (
            <DocumentView>
                <ScreenHeader
                    style={{
                    }}
                >
                    { new MyDate(this.state.currentDate).format("MMMM Do, HH:mm") }
                </ScreenHeader>
                <ScrollView>
                    <BackgroundTitle title={"Today"}
                        style={{
                        }}
                    ></BackgroundTitle>

                    <ConnectedStatusList
                        navigation={this.props.navigation}
                    ></ConnectedStatusList>

                    <RowView
                        style={{
                            justifyContent: "flex-start",
                            backgroundColor: PRIMARY_COLOR_LIGHT,
                            paddingRight: RIGHT_SECOND_MARGIN,
                        }}
                    >
                        <BackgroundTitle title={"Lists"}
                            style={{
                                marginTop: 2 * CONTAINER_VERTICAL_MARGIN,
                                alignSelf: "flex-end",
                            }}
                        ></BackgroundTitle>
                        <RowReverseView
                            style={[{
                                backgroundColor: PRIMARY_COLOR_LIGHT,
                            }, Styles.CENTERED_SECONDARY]}
                        >
                            <ModalIconButton type={"more"}
                                data={{
                                    showModal: this.state.showMore
                                }}
                                onDataChange={({ showModal }) => {
                                    this.setState({
                                        showMore: showModal
                                    })
                                }}
                            >
                                <ModalRow
                                    text={"Add Goal"}
                                    iconType={"complete"}
                                    onPress={() => {
                                        this.setState({
                                            showMore: false,
                                        })
                                    }}
                                ></ModalRow>
                            </ModalIconButton>
                            <IconButton type={"settings"}
                                onPress={() => {
                                    this.props.navigation.navigate("Settings")
                                }} 
                            >
                            </IconButton> 
                            <ModalIconButton type={"add"}
                                data={{
                                    showModal: this.state.showAdd
                                }}
                                onDataChange={({ showModal }) => {
                                    this.setState({
                                        showAdd: showModal
                                    })
                                }}
                            >
                                <ModalRow
                                    text={"Goal"}
                                    iconType={"goal"}
                                    iconBackground={"white"}
                                    onPress={() => {
                                        this.props.navigation.navigate("AddGoal")
                                        this.setState({
                                            showAdd: false,
                                        })
                                    }}
                                ></ModalRow>
                                <ModalRow
                                    text={"Task"}
                                    iconType={"task"}
                                    iconBackground={"white"}
                                    onPress={() => {
                                        this.props.navigation.navigate("AddTask")
                                        this.setState({
                                            showAdd: false,
                                        })
                                    }}
                                ></ModalRow>
                                <ModalRow
                                    text={"Reward"}
                                    iconType={"reward"}
                                    iconBackground={"white"}
                                    onPress={() => {
                                        this.props.navigation.navigate("AddReward")
                                        this.setState({
                                            showAdd: false,
                                        })
                                    }}
                                ></ModalRow>
                                <ModalRow
                                    text={"Penalty"}
                                    iconType={"penalty"}
                                    iconBackground={"white"}
                                    onPress={() => {
                                        this.props.navigation.navigate("AddPenalty")
                                        this.setState({
                                            showAdd: false,
                                        })
                                    }}
                                ></ModalRow>
                            </ModalIconButton>
                        </RowReverseView>
                    </RowView>
                    <NavigationList
                        navigation={this.props.navigation}
                    ></NavigationList>
                </ScrollView>
            </DocumentView>
        );
    }
}


interface StatusListProps {
    overdueTaskCount: number;
    remainingTodayTaskCount: number;
    inProgressGoalsCount: number;
    earnedRewardsCount: number;
    earnedPenaltiesCount: number;
    navigation: any;
}
const AdaptedStatusList: React.FunctionComponent<StatusListProps> = (props: StatusListProps) => {

    return (
        <NavigationGroup
            navigation={props.navigation}
            style={{
                marginBottom: 0
            }}
            rows={[
                { text: "Tasks Remaining"
                , number: props.remainingTodayTaskCount
                , navParams: {}
                , navDestination: "RemainingTasks"
                },
                { text: "Overdue"
                , number: props.overdueTaskCount
                , navParams: {}
                , navDestination: "Overdue"
                },
                { text: "Goals In Progress"
                , number: props.inProgressGoalsCount
                , navParams: {}
                , navDestination: "InProgressGoals"
                },
                { text: "Unused Rewards"
                , number: props.earnedRewardsCount
                , navParams: {}
                , navDestination: "UnusedEarnedRewards"
                },
                { text: "Pending Penalties"
                , number: props.earnedPenaltiesCount
                , navParams: {}
                , navDestination: "UnusedEarnedPenalties"
                },
            ]}
        >
        </NavigationGroup>
    );
}

interface AllStatusListProps {
    navigation: any
}

/**
 * TODO : earnedRewardsCount and earnedPenaltiesCount are still incorrect.
 * TODO :   It is very likely that earned rewards are unnecessary -- no need to make user
 * TODO :   perform the action. Just generate the reward for them automatically.
 */
const enhance = withObservables([], (_props: AllStatusListProps) => {
    return {
        overdueTaskCount: observableWithRefreshTimer(() => new TaskQuery().queryActiveAndOverdue().observeCount()),
        remainingTodayTaskCount: observableWithRefreshTimer(() => new TaskQuery().queryRemainingToday().observeCount()),
        inProgressGoalsCount: observableWithRefreshTimer(() => new GoalQuery().queryActiveAndStartedButNotDue().observeCount()),
        earnedRewardsCount: observableWithRefreshTimer(() => new EarnedRewardQuery().queryUnused().observeCount()),
        earnedPenaltiesCount: observableWithRefreshTimer(() => new EarnedPenaltyQuery().queryUnused().observeCount()),
    }
});

var ConnectedStatusList = enhance(AdaptedStatusList);


interface NavListProps {
    navigation: any;
}

class NavigationList extends React.Component<NavListProps> {

    render = () => {
        return (
            <NavigationGroup
                navigation={this.props.navigation}
                style={{
                    marginBottom: ROW_HEIGHT + 20,
                }}
                rows={[
                    { text: "Goals"
                    , icon: "goal"
                    , navParams: {}
                    , navDestination: "Goals"
                    },
                    { text: "Tasks"
                    , icon: "task"
                    , navParams: {}
                    , navDestination: "Tasks"
                    },
                    { text: "Rewards"
                    , icon: "reward"
                    , navParams: {}
                    , navDestination: "Rewards"
                    },
                    { text: "Penalties"
                    , icon: "penalty"
                    , navParams: {}
                    , navDestination: "Penalties"
                    },
                    { text: "Recurring Goals"
                    , icon: "recur"
                    , navParams: {}
                    , navDestination: "Recurrings"
                    },
                    { text: "Earned Rewards"
                    , icon: "earned_reward"
                    , navParams: {}
                    , navDestination: "EarnedRewards"
                    },
                    { text: "Earned Penalties"
                    , icon: "earned_penalty"
                    , navParams: {}
                    , navDestination: "EarnedPenalties"
                    }

                ]}
            >
            </NavigationGroup>
        )
    }
}