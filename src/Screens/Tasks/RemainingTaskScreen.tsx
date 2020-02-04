import React from "react";
import { ColumnView, RowView, RowReverseView, HeaderText } from "src/Components/Basic/Basic";
import { ScreenHeader, DocumentView, ClickRow, ListPicker, ListItem } from "src/Components/Styled/Styled";
import List from "src/Components/Lists/base/List";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native";

interface Props {
    navigation: any;
}

interface State {
    currentList: number;
}

export default class RemainingTaskScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Remaining Tasks',
        }
    }
    constructor(props: Props ){
        super(props);

        this.state = {
            currentList: 0,
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ScreenHeader>
                    {"Tasks Remaining"}
                </ScreenHeader>
                <ListPicker
                    data={{
                        current: this.state.currentList
                    }}  
                    onDataChange={({ current }) => {
                        this.setState({
                            currentList: current
                        })
                    }}
                    lists={this.renderLists()}
                    layout={"top"}
                >

                </ListPicker>
            </DocumentView>
        );
    }

    renderLists = () => {
        return [
            { selector: {              
                number: 3,
                text: "Due Today",
              },
              list: () => {
                  return  (
                      <List
                        items={[
                            { id: "1"
                            , text: "Do the dishes"
                            , subtext: "Today at 5:30 pm"
                            , number: 1
                            },
                            { id: "2"
                            , text: "Study for the final"
                            , subtext: "Today"
                            , number: 2
                            },
                            { id: "3"
                            , text: "Eat the leftover pizza"
                            , subtext: "Today"
                            , number: 3
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
                text: "In Progress",
              },
              list: () => {
                  return  (
                      <List
                        items={[
                            { id: "1"
                            , text: "Finish polishing portfolio so I can do all the winning"
                            , subtext: "In 2 weeks"
                            , number: 1
                            },
                            { id: "2"
                            , text: "Call parents"
                            , subtext: "Next week"
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
                navigation={this.props.navigation}
                destination={"SpecificTask"}
                params={{}}
                text={text}
                subtext={subtext}
                number={number}
                key={id}
            ></ListItem>
        );
    }
}