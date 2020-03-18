
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
                    { flex: 1,
                      justifyContent: "flex-start",
                      backgroundColor: "transparent",
                    }}
                    
                >
                    
                    <Svg
                        height={300}
                        width={300}
                        viewBox={[0, 0, this.width, this.height].join(" ")}
                    >
                        {this.renderBars(results)}
                    </Svg>

                </View>
            </DocumentView>
        );
    }

    private renderBars = (data: number[]) => {
        const x = d3.scaleBand<number>()
                    .domain(d3.range(data.length))
                    .range([0, this.width])
        const y = d3.scaleLinear()
                    .domain([0, 1])
                    .range([0, this.height])
        return (
            data.map((num, index) => {
                return (
                    <Rect
                        x={x(index)}
                        y={0}
                        width={x.bandwidth()}
                        height={y(num) - 1}
                        strokeWidth={1}
                        stroke={"black"}
                        fill={"grey"}
                        key={index}
                    ></Rect>
                )
            })
        )
    }
}