import React from "react";
import { ColumnView, ViewPicker } from "src/Components/Basic/Basic";
import { ConnectedGoalTaskList } from "src/ConnectedComponents/Lists/Composite/GoalTaskList";
import NavigationButton from "src/Components/Navigation/NavigationButton";

interface Props {
    navigation: any;
}

interface State {

}

export default class DashboardScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Dashboard',
        }
    }

    constructor(props: Props) {
        super(props);
    }

    renderListViews = () => {
        return [
            {   title: "Due",
                render: () => {
                    return (
                        <ConnectedGoalTaskList
                            navigation={this.props.navigation}
                            type={"dueAndOverdueActive"}
                        >
                        </ConnectedGoalTaskList>
                    );
                }
            },
            {   title: "In Progress",
                render: () => {
                    return (
                        <ConnectedGoalTaskList
                            navigation={this.props.navigation}
                            type={"startedButNotDueActive"}
                        >
                        </ConnectedGoalTaskList>
                    );
                }
            },
            {   title: "Upcoming",
                render: () => {
                    return (
                        <ConnectedGoalTaskList
                            navigation={this.props.navigation}
                            type={"notStartedActive"}
                        >
                        </ConnectedGoalTaskList>
                    )
                }
            }
        ]
    }

    render = () => {
        return (
            // Layout here approximates golden ratio 1.6 when comparing the list to the header + tabs
            <ColumnView style={[]}>
                <ColumnView style={{
                    flex: 3.7,
                    backgroundColor: "lightyellow",
                    justifyContent: "flex-start",
                }}>
                    <NavigationButton
                        navigation={this.props.navigation}
                        title={"Upcoming"}
                        parameters={{}}
                        destination={"Upcoming"}
                        accessibilityLabel={"upcoming-tasks-button"}
                    ></NavigationButton>
                    <NavigationButton
                        navigation={this.props.navigation}
                        title={"Rewards"}
                        parameters={{}}
                        destination={"Rewards"}
                        accessibilityLabel={"reward-list-button"}
                    ></NavigationButton>
                    <NavigationButton
                        navigation={this.props.navigation}
                        title={"Penalties"}
                        parameters={{}}
                        destination={"Penalties"}
                        accessibilityLabel={"penalty-list-button"}
                    ></NavigationButton>
                </ColumnView>

                <ColumnView style={{
                    flex: 9.3,
                    backgroundColor: "lightgreen",
                }}>
                    <ViewPicker
                        data={false}
                        onDataChange={() => {}}
                        accessibilityLabel={"lists"}
                        views={this.renderListViews()}
                        pickerFlex={1.3}
                        bodyFlex={8}
                    >

                    </ViewPicker>
                </ColumnView>
            </ColumnView>
        );
    }
}


