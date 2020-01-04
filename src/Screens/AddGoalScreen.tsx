import React from "react";
import { View } from "react-native";
import { AddGoalForm} from "src/Components";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";

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
    static navigationOptions = ({navigation}) => {
        return {
            title: 'New Goal',
        }
    }
    

    render = () => {
        return (
            <View style={[Style.container, Style.greenBg, localStyle.container]}>
                <AddGoalForm navigation={this.props.navigation}></AddGoalForm>

            </View>
        );
    }
}