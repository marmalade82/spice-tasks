
import React from "react";
import { View, Text } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView, RowReverseView } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { ScrollView } from "react-native";
import { 
    NavigationRow, ScreenHeader, DocumentView, 
    NavigationGroup, BackgroundTitle, Summary ,
    IconButton, ModalRow, ModalIconButton, Icon, Modal,
} from "src/Components/Styled/Styled";

import { EventDispatcher } from "src/common/EventDispatcher";
import { MainNavigator, ScreenNavigation, FullNavigation } from "src/common/Navigator";
import {
    Svg, Circle, Rect,
} from "react-native-svg";

import * as d3 from "d3";
import BarChart from "src/Components/Charts/BarChart";


interface Props {
    navigation: object;
}


interface State {
    ongoingGoalsCount: number;
}

const dispatcher = new EventDispatcher();

export default class StarScreen extends React.Component<Props, State> {
    width = 100;
    height = 100;
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Goal Dashboard',
        }
    }

    unsub: () => void;
    navigation: MainNavigator<"AppStart">;
    constructor(props: Props) {
        super(props);
        this.state = {
            ongoingGoalsCount: 0,
        }
        this.unsub = () => {}
        this.navigation = new ScreenNavigation(this.props);
    }


    render = () => {
        const results = [
            0.6,
            0.7,
            0,
            1.0,
            1.0,
            0.8,
            0,
        ]

        return (
            <DocumentView>
                <View style={
                    { flex: 0,
                      height: 100,
                      width: "100%",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginTop: 50,
                    }}
                    
                >
                   <BarChart
                        height={100}
                        width={200}
                        data={results}
                        max={1}
                        barFill={"steelblue"}
                        spacing={50}
                   ></BarChart> 

                </View>
            </DocumentView>
        );
    }
}