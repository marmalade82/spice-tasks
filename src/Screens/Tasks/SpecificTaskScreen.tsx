import React from "react";

import { ColumnView, RowView, RowReverseView, HeaderText, BodyText } from "src/Components/Basic/Basic";
import { ScreenHeader, DocumentView, ClickRow, ListPicker, NavigationRow } from "src/Components/Styled/Styled";
import List from "src/Components/Lists/base/List";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";

interface Props {
    navigation: any;
}

interface State {
    current: number;
}


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
                    {"Summary"}
                </ScreenHeader>
                <ScrollView>
                <ColumnView style={{
                    backgroundColor: "white",
                    justifyContent: "flex-start",
                    marginBottom: 10,
                    paddingBottom: 30,
                    flex: 0,
                    maxHeight: "66%",
                    overflow: "hidden",
                    elevation: 5,
                }}>
                    <ScrollView style={{
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
                                    I'd like to be better read, so I've started to 
                                    read on a regular basis. Classics that I've 
                                    put off reading, like the Great Gatsby and 
                                    Shakespeare, are now first in line on my bookshelf.
                                    I'd like to be better read, so I've started to 
                                    read on a regular basis. Classics that I've 
                                    put off reading, like the Great Gatsby and 
                                    Shakespeare, are now first in line on my bookshelf.
                                </BodyText>
                            </Text>
                        </RowView>
                    </ScrollView>
                </ColumnView>
                <NavigationRow
                    number={2}
                    text={"Active"}
                    navOptions={{
                        navigation: this.props.navigation,
                        destination: "SpecificTaskLists",
                        type: "push",
                        parameters: {
                            id: "",
                            index: 0,
                        }
                    }}
                    style={{
                        marginBottom: 0,
                        elevation: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: "lightgrey",
                    }}
                ></NavigationRow>
                <NavigationRow
                    number={2}
                    text={"Completed"}
                    navOptions={{
                        navigation: this.props.navigation,
                        destination: "SpecificTaskLists",
                        type: "push",
                        parameters: {
                            id: "",
                            index: 1,
                        }
                    }}
                >

                </NavigationRow>
                </ScrollView>
            </DocumentView>
        );
    }
}