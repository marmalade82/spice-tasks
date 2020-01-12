import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Style from "src/Style/Style";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList"
import { ConnectedGoalSummary } from "src/ConnectedComponents/Summaries/GoalSummary";
import Goal from "src/Models/Goal/Goal";
import GoalQuery from "src/Models/Goal/GoalQuery";


interface Props {
    navigation: any
}

interface State {
    goal?: Goal;
}

const localStyle = StyleSheet.create({
    container: {

    },
    summary: {
        flex: 1,
    },
    list: {
        flex: 2.5,
    },
    button: {
        position: 'absolute',
        right: 25,
        bottom: 25,
    }
});


export default class GoalScreen extends React.Component<Props, State> {

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Goal',
        }
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            goal: undefined
        }
    }

    componentDidMount = async () => {
        const id = this.props.navigation.getParam('id', '');
        const goal = await GoalQuery.get(id); 

        if(goal) {
            this.setState({
                goal: goal
            })

        } else {
            this.setState({
                goal: undefined
            });
        }
    }

    onClick = () => {
        const params = {
            id: this.props.navigation.getParam('id', ''),
        };
        this.props.navigation.navigate('AddGoal', params);
    }

    render = () => {
        return (
            <View style={[Style.container, Style.redBg]}>
                <View
                    style={[Style.container, localStyle.summary, Style.yellowBg]}
                >
                    {this.renderSummary()}
                </View>
                <View style={[Style.container, localStyle.list]}>
                    <ConnectedTaskList
                        navigation={this.props.navigation}
                    ></ConnectedTaskList>
                </View>
                <View style={[localStyle.button]}>
                    <Button
                        title={"edit"}
                        onPress={this.onClick}
                        color="purple"
                    />
                </View>
            </View>
        );
    }

    renderSummary = () => {
        if(this.state.goal) {
            return (
                    <ConnectedGoalSummary
                        goal={this.state.goal} 
                    ></ConnectedGoalSummary>
            );
        }
    }
}