import React from "react";
import List from "src/Components/Lists/base/List";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import { ColumnView, RowView, RowReverseView, HeaderText, BodyText } from "src/Components/Basic/Basic";
import { 
    ScreenHeader, DocumentView, ClickRow, 
    ListPicker, NavigationRow, ListItem,
} from "src/Components/Styled/Styled";

interface Props {
    navigation: object,
}

interface State {
    current: number;
}

export default class SpecificTaskListScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Specific Task List',
        }
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            current: parseInt(this.props.navigation.getParam("index", 0)),
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ListPicker
                    data={{
                        current: this.state.current
                    }}  
                    onDataChange={({ current }) => {
                        this.setState({
                            current: current,
                        })
                    }}
                    lists={this.renderLists()}
                    layout="top"
                    style={{
                        flex: 1,
                    }}
                >

                </ListPicker>
            </DocumentView>
        );
    }

    renderLists = () => {
        return [
            { selector: {
                number: 2,
                text: "Active",
              },
              list: () => {
                  return  (
                      <List
                        items={[
                            { id: "1"
                            , text: "Spring Cleaning"
                            , subtext: "Due in 3 days"
                            , number: 1
                            },
                            { id: "2"
                            , text: "Call parents"
                            , subtext: "Today"
                            , number: 2
                            },
                        ]}
                        renderItem={this.renderItem}
                      ></List>
                  );
              }
            },
            { selector: {
                number: 2,
                text: "Completed",
              },
              list: () => {
                  return  (
                      <List
                        items={[
                            { id: "1"
                            , text: "Finish polishing portfolio so I can do all the winning"
                            , subtext: "Completed 3 hours ago"
                            , number: 1
                            },
                            { id: "2"
                            , text: "Call parents"
                            , subtext: "Completed yesterday"
                            , number: 2
                            },
                        ]}
                        renderItem={this.renderItem}
                      ></List>
                  );
              }
            },
        ]
    }

    renderItem = (item: {id: string, text: string, number: number,subtext: string }) => {
        const {id, text, number, subtext} = item;
        return (
            <ListItem
                destination={"SpecificTask"}
                navigation={this.props.navigation}
                params={{}}
                text={text}
                subtext={subtext}
                number={number}
                key={id}
            ></ListItem>
        );
    }
}




                