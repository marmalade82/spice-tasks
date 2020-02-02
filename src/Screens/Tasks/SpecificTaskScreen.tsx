import React from "react";

import { ColumnView, RowView, RowReverseView, HeaderText, BodyText } from "src/Components/Basic/Basic";
import { ScreenHeader, DocumentView, ClickRow, ListPicker } from "src/Components/Styled/Styled";
import List from "src/Components/Lists/base/List";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
    navigation: any;
}

interface State {
    current: number;
}

const titles = [
    "Active",
    "Completed",
]

export default class SpecificTaskScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Specific Task',
        }
    }
    constructor(props: Props ){
        super(props);

        this.state = {
            current: -1,
        }
    }

    render = () => {

        return (
            <DocumentView>
                <ScreenHeader>
                    {titles[this.state.current] ? titles[this.state.current] : "Summary"}
                </ScreenHeader>
                <ColumnView style={{
                    backgroundColor: "white",
                    justifyContent: "flex-start",
                    elevation: 5,
                }}>
                    <RowView style={{
                        flex: 0,
                        justifyContent: "flex-start",
                        paddingLeft: 15,
                        paddingRight: 15 + 25,
                        alignItems: "stretch",
                    }}>
                        <RowView style={{
                            flex: 1,
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}>
                            <View style={{
                                height: 37,
                                width: 37,
                                borderRadius: 37/2,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "white"
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
                                    {"Finish 3 Books this month, ideally with plenty of time to spare"}
                                </HeaderText>
                            </Text>
                        </RowView>

                    </RowView>
                    <RowView style={{
                        flex: 0,
                        justifyContent: "flex-start",
                        paddingLeft: 15 + 9 + 37,
                        paddingRight: 15 + 25,
                        alignItems: "stretch",
                    }}>
                        <Text style={{
                        }}>
                            <BodyText style={{
                                }}
                            > 
                                {"1/12/2020"}
                                { " \u2013 "}
                                {"1/18/2020\n\n"}
                            </BodyText>
                            <BodyText style={{}}>
                                I'd like to be better read, so I've started to 
                                read on a regular basis. Classics that I've 
                                put off reading, like the Great Gatsby and 
                                Shakespeare, are now first in line on my bookshelf.
                            </BodyText>
                        </Text>
                    </RowView>


                </ColumnView>
                <ListPicker
                    data={{
                        current: this.state.current
                    }}  
                    onDataChange={({ current }) => {
                        this.setState({
                            current: current
                        })
                    }}
                    lists={this.renderLists()}
                    layout="bottom"
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
                        this.props.navigation.navigate("SpecificTask")
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