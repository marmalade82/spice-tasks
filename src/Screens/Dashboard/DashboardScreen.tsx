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
            {   title: "Menu",
                render: () => {
                    return (
                        <ColumnView style={[{justifyContent: "flex-start"}]}>
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
                    )
                }
            }
        ]
    }

    render = () => {
        return (
            <ColumnView style={[]}>
                <ViewPicker
                    data={false}
                    onDataChange={() => {}}
                    accessibilityLabel={"lists"}
                    views={this.renderListViews()}
                    pickerHeight={60}
                >

                </ViewPicker>
            </ColumnView>
        );
    }
}


