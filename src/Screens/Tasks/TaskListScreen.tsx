
import React from "react";
import { View, ScrollView, SafeAreaView, Button } from "react-native";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList";

interface Props {
    navigation: any;
}

interface State { 
}

const localStyle = StyleSheet.create({
    container: {
    },
    button: {
        position: 'absolute',
        right: 25,
        bottom: 25,
    }
});

export default class TaskListScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Task List',
        }
    }

    render = () => {
        return (
            <View style={[Style.container, localStyle.container]}>
                <ConnectedTaskList
                    navigation={this.props.navigation}
                    parentId={false}
                ></ConnectedTaskList>
                <View style={[localStyle.button]}>
                    <Button
                        title={"add"}
                        onPress={() => {
                            const params = {
                                id: ""
                            };
                            this.props.navigation.navigate('AddTask', params);
                        }}
                    />
                </View>
            </View>
        );
    }
}