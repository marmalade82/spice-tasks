
import React from "react";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";
import { DocumentView, Icon } from "src/Components/Styled/Styled";
import { GoalLogic } from "src/Models/Goal/GoalQuery";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { FullNavigation, MainNavigator, ScreenNavigation } from "src/common/Navigator";
import { ConnectedStreakCycleList } from "src/ConnectedComponents/Lists/Group/StreakCycleList";

interface Props {
    navigation: object;
}

interface State {

}


export class StreakCycleListScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Cycles',
        }
    }

    navigation: MainNavigator<"StreakCycles">;
    constructor(props: Props) {
        super(props);
        this.navigation = new ScreenNavigation(props);
    }

    render = () => {
        return (
            <ConnectedStreakCycleList
                navigation={this.navigation}
                type={this.navigation.getParam("type", undefined) as any}
                goalId={this.navigation.getParam("goalId", undefined)}
            ></ConnectedStreakCycleList>
        );
    }
}


export default StreakCycleListScreen;