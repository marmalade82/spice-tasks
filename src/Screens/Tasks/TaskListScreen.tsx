
import React from "react";
import { View, ScrollView, SafeAreaView, Button, Text } from "react-native";
import Style from "src/Style/Style";
import { StyleSheet } from "react-native";
import { ConnectedTaskList } from "src/ConnectedComponents/Lists/Task/TaskList";
import { DocumentView } from "src/Components/Styled/Styled";
import { TaskLogic } from "src/Models/Task/TaskQuery";

interface Props {
    navigation: any;
}

interface State { 
}

const localStyle = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        alignItems: 'stretch',
        backgroundColor: "lightyellow",
        flex: 1
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

    onTaskAction = (id: string, action: "complete" | "fail") => {
        switch(action) {
            case "complete": {
                void new TaskLogic(id).complete();
            } break; 
            case "fail": {
                void new TaskLogic(id).fail();
            } break;
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ConnectedTaskList
                    navigation={this.props.navigation}
                    parentId={""}
                    type={"all"}
                    onTaskAction={this.onTaskAction}
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
            </DocumentView>
        );
    }
}