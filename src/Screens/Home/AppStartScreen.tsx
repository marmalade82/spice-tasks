
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

interface Props {
    navigation: any;
}


interface State {
    currentDate: Date,
    unsubscribe: () => void;
    showMore: boolean;
    showAdd: boolean;
}

export default class AppStartScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Spice!',
        }
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            unsubscribe: () => {},
            showMore: false,
            showAdd: false,
        }
    }

    componentDidMount = () => {
        /*
        const minutes = (1000 * 60) * 30 // 30 minutes
        
        // Every 30 minutes, we update the date
        const handle = setInterval(() => {
            this.setState({
                currentDate: new Date(),
            });
        }, minutes)

        this.setState({
            unsubscribe: () => {
                clearInterval(handle);
            }
        })*/
    }

    componentWillUnmount = () => {
        this.state.unsubscribe();
    }

    render = () => {
        return (
            <DocumentView>
                <ScreenHeader
                    style={{
                    }}
                >
                    { new MyDate(this.state.currentDate).format("MMMM Do, YYYY") }
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
                    <NavigationGroup
                        navigation={this.props.navigation}
                        style={{
                            marginBottom: ROW_HEIGHT + 20,
                        }}
                        rows={[
                            { text: "Goals"
                            , number: 4
                            , navParams: {}
                            , navDestination: "Goals"
                            },
                            { text: "Tasks"
                            , number: 2
                            , navParams: {}
                            , navDestination: "Tasks"
                            },
                            { text: "Rewards"
                            , number: 1
                            , navParams: {}
                            , navDestination: "Rewards"
                            },
                            { text: "Penalties"
                            , number: 5
                            , navParams: {}
                            , navDestination: "Penalties"
                            },
                        ]}
                    >
                    </NavigationGroup>
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
                { text: "Rewards Earned"
                , number: props.earnedRewardsCount
                , navParams: {}
                , navDestination: "EarnedRewards"
                },
                { text: "Penalty Pending"
                , number: props.earnedPenaltiesCount
                , navParams: {}
                , navDestination: "EarnedPenalties"
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
        overdueTaskCount: new TaskQuery().queryActiveAndOverdue().observeCount(),
        remainingTodayTaskCount: new TaskQuery().queryActiveAndDueSoonToday().observeCount(),
        inProgressGoalsCount: new GoalQuery().queryActiveAndStartedButNotDue().observeCount(),
        earnedRewardsCount: new EarnedRewardQuery().queryUnused().observeCount(),
        earnedPenaltiesCount: new EarnedRewardQuery().queryAll().observeCount(),
    }
});

var ConnectedStatusList = enhance(AdaptedStatusList);