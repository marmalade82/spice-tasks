import React from "react";

import { ColumnView, RowView, RowReverseView, HeaderText, BodyText } from "src/Components/Basic/Basic";
import { 
    ScreenHeader, DocumentView, ClickRow, 
    ListPicker, NavigationRow, Summary
} from "src/Components/Styled/Styled";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { 
    LEFT_SECOND_MARGIN, ICON_CONTAINER_WIDTH, PRIMARY_COLOR, 
    RIGHT_SECOND_MARGIN, TEXT_HORIZONTAL_MARGIN, SECONDARY_COLOR, 
    PRIMARY_COLOR_LIGHT, CONTAINER_VERTICAL_MARGIN, CONTAINER_ELEVATION, 
    LEFT_FIRST_MARGIN, Styles, TEXT_VERTICAL_MARGIN, ROW_HEIGHT,
} from "src/Components/Styled/Styles";
import IconButton from "src/Components/Styled/IconButton";

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
                    <Summary
                        style={{}}
                        headerText={"Finish 3 Books this month, ideally with plenty of time to spare"} 
                        bodyText={() => {
                            return (
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
                            )
                        }}
                        footerElements={[
                            () => { return <IconButton type={"edit"}></IconButton>},
                            () => { return <IconButton type={"add"}></IconButton>},
                            () => { return <IconButton type={"more"}></IconButton>},
                        ]}
                    >
                    </Summary>
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