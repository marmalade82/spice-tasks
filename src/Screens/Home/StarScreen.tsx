
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

import { BarChart, LineChart }from "src/Components/Charts/Charts";
import AddModal from "./common/AddModal";


interface Props {
    navigation: object;
}


interface State {
    ongoingGoalsCount: number;
    showAdd: boolean
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
            showAdd: false,
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

        const results2: [number, number][] = [
            [ 10, 0.6],
            [ 20, 0.7],
            [ 30, 0],
            [ 40, 1.0],
            [ 50, 1.0],
            [ 70, 0.8],
            [ 80, 0],
        ]

        return (
            <DocumentView accessibilityLabel={"star"}>
                <View style={
                    { flex: 0,
                      height: 100,
                      width: "100%",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginTop: 50,
                      backgroundColor:"lightgreen",
                    }}
                    
                >
                   <BarChart
                        height={150}
                        width={300}
                        data={results}
                        max={1}
                        barFill={"steelblue"}
                        spacing={50}
                        xAxisMargin={20}
                        yAxisMargin={20}
                        outerMargin={20}
                   ></BarChart> 
                </View>
                <View style={
                    { flex: 0,
                      height: 100,
                      width: "100%",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginTop: 50,
                      backgroundColor: "lightblue"
                    }}
                    
                >
                    <LineChart
                        height={150}
                        width={300}
                        data={results2}
                        yMax={1}
                        xAxisMargin={20}
                        yAxisMargin={20}
                        outerMargin={20}
                   ></LineChart> 
                </View>
                <AddModal
                    visible={this.state.showAdd}
                    onRequestClose={() => this.setState({ showAdd: false })}
                    navigation={this.navigation}
                ></AddModal>
            </DocumentView>
        );
    }
}