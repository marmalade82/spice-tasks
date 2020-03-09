
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
import { Subscription } from "rxjs";
import EarnedRewardQuery from "src/Models/Reward/EarnedRewardQuery";
import EarnedPenaltyQuery from "src/Models/Penalty/EarnedPenaltyQuery";
import { ConnectedEarnedRewardList } from "src/ConnectedComponents/Lists/Reward/EarnedRewardList";
import { ConnectedEarnedPenaltyList } from "src/ConnectedComponents/Lists/Penalty/EarnedPenaltyList";
import EarnedRewardLogic from "src/Models/Reward/EarnedRewardLogic";
import EarnedPenaltyLogic from "src/Models/Penalty/EarnedPenaltyLogic";
import FootSpacer from "src/Components/Basic/FootSpacer";

interface Props {
    navigation: any;
}

interface State {
    showAdd: boolean;
    earnedRewardsCount: number;
    earnedPenaltiesCount: number;
}


export default class ListsScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Lists',
        }
    }
    
    unsub: () => void;
    constructor(props: Props) {
        super(props);

        this.state = {
            showAdd: false,
            earnedRewardsCount: 0,
            earnedPenaltiesCount: 0,
        }

        this.unsub = () => {};
    }

    componentDidMount = () => {
        const earnedRewardSub = new EarnedRewardQuery().queryUnused().observeCount().subscribe((count) => {
            this.setState({
                earnedRewardsCount: count,
            })
        })

        const earnedPenaltiesSub = new EarnedPenaltyQuery().queryUnused().observeCount().subscribe((count) => {
            this.setState({
                earnedPenaltiesCount: count,
            })
        })

        this.unsub = () => {
            earnedRewardSub.unsubscribe();
            earnedPenaltiesSub.unsubscribe();
        }
    }

    componentWillUnmount = () => {
        this.unsub();
    }

    onEarnedRewardAction = (id: string, action: "use") => {
        switch(action) {
            case "use": {
                void new EarnedRewardLogic(id).use();
            } break;
        }
    }

    onEarnedPenaltyAction = (id: string, action: "use") => {
        switch(action) {
            case "use": {
                void new EarnedPenaltyLogic(id).use();
            } break;
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ScrollView>
                    <BackgroundTitle
                        title={`Unused Rewards (${this.state.earnedRewardsCount})`}
                        style={{
                            marginTop: 0,
                        }}
                    ></BackgroundTitle>

                    <ConnectedEarnedRewardList
                        navigation={this.props.navigation}
                        paginate={4}
                        type={"unused"}
                        onSwipeRight={(id) => {
                            this.onEarnedRewardAction(id, "use");
                        }}
                        onEarnedRewardAction={this.onEarnedRewardAction}
                    ></ConnectedEarnedRewardList>

                    <BackgroundTitle
                        title={`Pending Penalties (${this.state.earnedRewardsCount})`}
                    ></BackgroundTitle>

                    <ConnectedEarnedPenaltyList
                        navigation={this.props.navigation}
                        paginate={4}
                        type={"unused"}
                        onEarnedPenaltyAction={this.onEarnedPenaltyAction}
                        onSwipeRight={(id: string) => {
                            this.onEarnedPenaltyAction(id, "use")
                        }}
                    ></ConnectedEarnedPenaltyList>

                    <BackgroundTitle title={"Full Lists"}
                        style={{
                        }}
                    ></BackgroundTitle>
                    <NavigationList
                        navigation={this.props.navigation}
                    ></NavigationList>
                    <FootSpacer></FootSpacer>
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