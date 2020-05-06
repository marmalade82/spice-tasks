
import React from "react";
import { ScrollView } from "react-native";
import { 
    NavigationRow, ScreenHeader, DocumentView, 
    NavigationGroup, BackgroundTitle, Summary ,
} from "src/Components/Styled/Styled";

import { ConnectedEarnedRewardList } from "src/ConnectedComponents/Lists/Reward/EarnedRewardList";
import { ConnectedEarnedPenaltyList } from "src/ConnectedComponents/Lists/Penalty/EarnedPenaltyList";
import EarnedRewardLogic from "src/Models/Reward/EarnedRewardLogic";
import EarnedPenaltyLogic from "src/Models/Penalty/EarnedPenaltyLogic";
import FootSpacer from "src/Components/Basic/FootSpacer";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderAddButton, HeaderSettingsButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { MainNavigator, ScreenNavigation, FullNavigation } from "src/common/Navigator";
import AddModal from "./common/AddModal";

interface Props {
    navigation: object;
}

interface State {
}

const dispatcher = new EventDispatcher();

export default class ListsScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Lists',
            right: [
                () => { return (
                    <HeaderSettingsButton
                        dispatcher={dispatcher}
                        eventName={getKey(navigation)}
                    ></HeaderSettingsButton>
                )}
            ],
        }
    }
    
    unsub: () => void;
    navigation: MainNavigator<"Lists">
    constructor(props: Props) {
        super(props);

        this.state = {
        }

        this.unsub = () => {};
        this.navigation = new ScreenNavigation(this.props);
    }

    componentDidMount = () => {

        dispatcher.addEventListener(getKey(this.navigation), this.onClickSettings);

        this.unsub = () => {
            dispatcher.removeEventListener(getKey(this.navigation), this.onClickSettings);
        }
    }

    componentWillUnmount = () => {
        this.unsub();
    }

    private onEarnedRewardAction = (id: string, action: "use") => {
        switch(action) {
            case "use": {
                void new EarnedRewardLogic(id).use();
            } break;
        }
    }

    private onEarnedPenaltyAction = (id: string, action: "use") => {
        switch(action) {
            case "use": {
                void new EarnedPenaltyLogic(id).use();
            } break;
        }
    }

    private onClickSettings = () => {
        this.navigation.navigate("Settings", {})
    }

    render = () => {
        return (
            <DocumentView accessibilityLabel={"lists"}>
                <ScrollView>
                    <BackgroundTitle
                        title={`Unused Rewards`}
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
                        title={`Pending Penalties`}
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
                ]}
            >
            </NavigationGroup>
        )
    }
}