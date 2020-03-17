import React from "react";
import { View, Text } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { NavigationRow, ScreenHeader, DocumentView } from "src/Components/Styled/Styled";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";

interface Props {
    navigation: object;
}


interface State {

}

export default class HomePageScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Spice!',
        }
    }

    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <DocumentView>

                <NavigationRow
                    number={4}
                    text={"Tasks Remaining"}
                    navOptions={{
                        navigation: this.props.navigation,
                        destination: "RemainingTasks",
                        parameters: {},
                        type: "navigate",
                    }}
                >
                </NavigationRow>

                <NavigationRow
                    number={2}
                    text={"Overdue"}
                    navOptions={{
                        navigation: this.props.navigation,
                        destination: "Overdue",
                        parameters: {},
                        type: "navigate",
                    }}
                >
                </NavigationRow>

                <NavigationRow
                    number={1}
                    text={"Goal In Progress"}
                    navOptions={{
                        navigation: this.props.navigation,
                        destination: "InProgressGoals",
                        parameters: {},
                        type: "navigate",
                    }}
                >
                </NavigationRow>

                <NavigationRow
                    number={5}
                    text={"Rewards Earned"}
                    navOptions={{
                        navigation: this.props.navigation,
                        destination: "EarnedRewards",
                        parameters: {},
                        type: "navigate",
                    }}
                >
                </NavigationRow>

                <NavigationRow
                    number={1}
                    text={"Penalty Pending"}
                    navOptions={{
                        navigation: this.props.navigation,
                        destination: "EarnedPenalties",
                        parameters: {},
                        type: "navigate",
                    }}
                >
                </NavigationRow>
            </DocumentView>
        );
    }
}