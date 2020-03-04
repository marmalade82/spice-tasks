
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
import GoalQuery, { GoalLogic } from "src/Models/Goal/GoalQuery";
import TaskQuery, { TaskLogic } from "src/Models/Task/TaskQuery";
import EarnedRewardQuery from "src/Models/Reward/EarnedRewardQuery";
import EarnedPenaltyLogic from "src/Models/Penalty/EarnedPenaltyLogic";
import { Schedule } from "Schedule";
import GlobalQuery, { GlobalLogic, Global_Timer, observableWithRefreshTimer } from "src/Models/Global/GlobalQuery";
import { Subscription } from "rxjs";
import EarnedPenaltyQuery from "src/Models/Penalty/EarnedPenaltyQuery";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";

interface Props {
    navigation: any;
}

interface State {
    showAdd: boolean;
}


export default class ListsScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Lists',
        }
    }
    
    constructor(props: Props) {
        super(props);

        this.state = {
            showAdd: true,
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ScreenHeader
                    style={{
                    }}
                >
                    { "Lists" }
                </ScreenHeader>
                <ScrollView>
                    <BackgroundTitle title={"Full Lists"}
                        style={{
                            marginTop: 2 * CONTAINER_VERTICAL_MARGIN,
                        }}
                    ></BackgroundTitle>
                    <NavigationList
                        navigation={this.props.navigation}
                    ></NavigationList>
                    <View style={{flex: 0, marginBottom: ROW_CONTAINER_HEIGHT / 2}}></View>
                </ScrollView>
                <View
                    style={{
                        flex: 0,
                        position: "absolute",
                        right: 50,
                        bottom: 20,
                    }}
                >
                    <ModalIconButton type={"add"}
                        data={{
                            showModal: this.state.showAdd
                        }}
                        onDataChange={({ showModal }) => {
                            this.setState({
                                showAdd: showModal
                            })
                        }}
                        size={30}
                        overlaySize={50}
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
                </View>
            </DocumentView>
        )
    }

}

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