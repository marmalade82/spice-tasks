import React from "react";
import { View, Button } from "react-native";
import { AddGoalForm} from "src/Components";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { GoalQuery, Goal } from "src/Models/Goal/GoalQuery";
import { ConnectedAddGoalForm } from "src/ConnectedComponents/Forms/AddGoalForm";

interface Props {
    navigation: any;
}

interface State { }

const localStyle = StyleSheet.create({
    container: {
        paddingLeft: "2%",
        paddingRight: "2%",
        paddingTop: "2%",
        paddingBottom: "2%",
    },
});


export default class AddGoalScreen extends React.Component<Props> {
    goal?: Goal
    static navigationOptions = ({navigation}) => {
        return {
            title: 'New Goal',
        }
    }

    onComponentDidMount = async () => {
        const id = this.props.navigation.getParam('id', '');

        /*  If we received a valid string as an id,
            then we'll find it with the query.
            Otherwise we must try to create a new goal
        */
        const goal = await GoalQuery.get(id); 
        if(goal) {
            this.goal = goal;
        }
    }

    renderGoalForm = () => {
        if(this.goal) {
            return (
                <ConnectedAddGoalForm
                    goal={this.goal}
                    navigation={this.props.navigation}
                ></ConnectedAddGoalForm>
            );
        } else {
            return (
                <AddGoalForm 
                    navigation={this.props.navigation}
                    onDataChange={()=>{}}
                />
            );
        }
    }
 

    render = () => {
        return (
            <View style={[Style.container, Style.greenBg, localStyle.container]}>
                { this.renderGoalForm() }
                <Button
                    title={"SAVE"}
                    onPress={() => {
                        GoalQuery.create({
                            title: "done",
                        })
                        .catch();  // Nothing to do if create fail -- since it should never fail
                    }}
                />

            </View>
        );
    }
}