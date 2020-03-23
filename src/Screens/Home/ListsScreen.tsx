
import React from "react";
import { View, Text } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView, RowReverseView } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { ScrollView } from "react-native";
import { 
    NavigationRow, ScreenHeader, DocumentView, 
    NavigationGroup, BackgroundTitle, Summary ,
    IconButton, ModalRow, ModalIconButton, Icon, Modal,
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
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { MainNavigator, ScreenNavigation, FullNavigation } from "src/common/Navigator";
import { TaskParentTypes } from "src/Models/Task/Task";

interface Props {
    navigation: object;
}

interface State {
    showAdd: boolean;
    earnedRewardsCount: number;
    earnedPenaltiesCount: number;
}

const dispatcher = new EventDispatcher();

export default class ListsScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Lists',
            right: [
                () => { return (
                    <HeaderAddButton
                        dispatcher={dispatcher}
                        eventName={getKey(navigation)}
                    ></HeaderAddButton>
                )}
            ],
        }
    }
    
    unsub: () => void;
    navigation: MainNavigator<"Lists">
    constructor(props: Props) {
        super(props);

        this.state = {
            showAdd: false,
            earnedRewardsCount: 0,
            earnedPenaltiesCount: 0,
        }

        this.unsub = () => {};
        this.navigation = new ScreenNavigation(this.props);
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

        dispatcher.addEventListener(getKey(this.navigation), this.onClickAdd);

        this.unsub = () => {
            dispatcher.removeEventListener(getKey(this.navigation), this.onClickAdd);
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

    onClickAdd = () => {
        this.setState({
            showAdd: true
        })
    }

    render = () => {
        return (
            <DocumentView accessibilityLabel={"lists"}>
                <ScrollView>
                    <BackgroundTitle
                        title={`Unused Rewards (${this.state.earnedRewardsCount})`}
                        style={{
                            marginTop: 0,
                        }}
                    ></BackgroundTitle>

                    <ConnectedEarnedRewardList
                        navigation={this.navigation}
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
                        navigation={this.navigation}
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
                        navigation={this.navigation}
                    ></NavigationList>
                    <FootSpacer></FootSpacer>
                </ScrollView>
                <Modal
                    visible={this.state.showAdd}
                    onRequestClose={() => {
                        this.setState({
                            showAdd: false,
                        })
                    }}
                >
                        <ModalRow
                            accessibilityLabel={"add-goal"}
                            text={"Goal"}
                            iconType={"goal"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.navigation.navigate("AddGoal", {
                                    id: "",
                                    parent_id: "",
                                })
                                this.setState({
                                    showAdd: false,
                                })
                            }}
                        ></ModalRow>
                        <ModalRow
                            accessibilityLabel={"add-task"}
                            text={"Task"}
                            iconType={"task"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.navigation.navigate("AddTask", {
                                    id: "",
                                    parent_id: "",
                                    parent_type: TaskParentTypes.NONE,
                                })
                                this.setState({
                                    showAdd: false,
                                })
                            }}
                        ></ModalRow>
                        <ModalRow
                            accessibilityLabel={"add-reward"}
                            text={"Reward"}
                            iconType={"reward"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.navigation.navigate("AddReward", {
                                    id: "",
                                    parent_id: "",
                                })
                                this.setState({
                                    showAdd: false,
                                })
                            }}
                        ></ModalRow>
                        <ModalRow
                            accessibilityLabel={"add-penalty"}
                            text={"Penalty"}
                            iconType={"penalty"}
                            iconBackground={"white"}
                            onPress={() => {
                                this.navigation.navigate("AddPenalty", {
                                    id: "",
                                    parent_id: "",
                                })
                                this.setState({
                                    showAdd: false,
                                })
                            }}
                        ></ModalRow>
                </Modal>
            </DocumentView>
        )
    }

}

interface NavListProps {
    navigation: FullNavigation;
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
                    , accessibilityLabel: "dest-goals"
                    },
                    { text: "Tasks"
                    , icon: "task"
                    , navParams: {}
                    , navDestination: "Tasks"
                    , accessibilityLabel: "dest-tasks"
                    },
                    { text: "Rewards"
                    , icon: "reward"
                    , navParams: {}
                    , navDestination: "Rewards"
                    , accessibilityLabel: "dest-rewards"
                    },
                    { text: "Penalties"
                    , icon: "penalty"
                    , navParams: {}
                    , navDestination: "Penalties"
                    , accessibilityLabel: "dest-penalties"
                    },
                    { text: "Recurring Goals"
                    , icon: "recur"
                    , navParams: {}
                    , navDestination: "Recurrings"
                    , accessibilityLabel: "dest-recurring-goals"
                    },
                    { text: "Earned Rewards"
                    , icon: "earned_reward"
                    , navParams: {}
                    , navDestination: "EarnedRewards"
                    , accessibilityLabel: "dest-earned-rewards"
                    },
                    { text: "Earned Penalties"
                    , icon: "earned_penalty"
                    , navParams: {}
                    , navDestination: "EarnedPenalties"
                    , accessibilityLabel: "dest-earned-penalties"
                    },
                    { text: "Menu"
                    , icon: "goal"
                    , navParams: {}
                    , navDestination: "Menu"
                    , accessibilityLabel: "dest-menu"
                    }
                ]}
            >
            </NavigationGroup>
        )
    }
}