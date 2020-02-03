import React from "react";
import List from "src/Components/Lists/base/List";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { ColumnView, RowView, RowReverseView, HeaderText, BodyText } from "src/Components/Basic/Basic";
import { ScreenHeader, DocumentView, ClickRow, ListPicker, NavigationRow } from "src/Components/Styled/Styled";

interface Props {
    navigation: any,
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
                <ScreenHeader>
                    Child Tasks 
                </ScreenHeader>
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
            <ColumnView
                style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                    backgroundColor: "white",
                }}
            >
                <TouchableOpacity style={{
                        flex: 0
                    }}
                    onPress={() =>  {
                        this.props.navigation.push("SpecificTask")
                    }}
                >
                    <RowView style={{
                        justifyContent: "flex-start",
                        paddingLeft: 15,
                        paddingRight: 15,
                        alignItems: "stretch",
                    }}>
                        <RowView style={{
                            flex: 1,
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}>
                            <View style={{
                                height: "100%",
                                width: 37,
                                borderRadius: 37/2,
                                justifyContent: "flex-start",
                                alignItems: "center",
                                marginTop: 33,
                            }}>
                                <Icon
                                    name='sc-telegram'
                                    type='evilicon'
                                    color='darkgreen'
                                ></Icon>
                                
                            </View>
                            <Text style={{
                                    margin: 15,
                                    marginLeft: 9,
                                }}
                            >
                                <HeaderText 
                                    level={3} 
                                    style={{
                                        
                                    }}
                                >
                                    {text + "\n"}
                                </HeaderText>
                                <HeaderText level={5} style={{
                                    }}
                                > 
                                    {subtext} 
                                </HeaderText>
                            </Text>
                        </RowView>

                        <RowReverseView style={{
                            flex: 0,
                            justifyContent: "flex-start",
                            minWidth: 60,
                            alignItems: "center",
                        }}>
                            <View style={{
                                height: 37,
                                width: 37,
                                borderRadius: 37/2,
                                backgroundColor: "rgb(191,38,0)",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <HeaderText level={3} style={{
                                    color: "white",
                                }}>
                                    { number }
                                </HeaderText>
                            </View>
                        </RowReverseView>
                    </RowView>
                </TouchableOpacity>
            </ColumnView>
        );
    }
}




                