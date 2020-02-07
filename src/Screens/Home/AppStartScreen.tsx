
import React from "react";
import { View, Text } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView, RowReverseView } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { ScrollView } from "react-native";
import { 
    NavigationRow, ScreenHeader, DocumentView, 
    NavigationGroup, BackgroundTitle, Summary ,
    IconButton, ModalRow, ModalIconButton,
} from "src/Components/Styled/Styled";

import { 
    CONTAINER_VERTICAL_MARGIN, ROW_CONTAINER_HEIGHT, Styles, 
    LEFT_SECOND_MARGIN, PRIMARY_COLOR_LIGHT, LEFT_FIRST_MARGIN, ICON_CONTAINER_WIDTH, RIGHT_SECOND_MARGIN, ROW_HEIGHT
} from "src/Components/Styled/Styles";

interface Props {
    navigation: any;
}


interface State {
    currentDate: Date,
    unsubscribe: () => void;
    showMore: boolean;
    showAdd: boolean;
}

export default class AppStartScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Spice!',
        }
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            currentDate: new Date(),
            unsubscribe: () => {},
            showMore: false,
            showAdd: false,
        }
    }

    componentDidMount = () => {
        /*
        const minutes = (1000 * 60) * 30 // 30 minutes
        
        // Every 30 minutes, we update the date
        const handle = setInterval(() => {
            this.setState({
                currentDate: new Date(),
            });
        }, minutes)

        this.setState({
            unsubscribe: () => {
                clearInterval(handle);
            }
        })*/
    }

    componentWillUnmount = () => {
        this.state.unsubscribe();
    }

    render = () => {
        return (
            <DocumentView>
                <ScreenHeader
                    style={{
                    }}
                >
                    { new MyDate(this.state.currentDate).format("MMMM Do, YYYY") }
                </ScreenHeader>
                <ScrollView>

                    <BackgroundTitle title={"Today"}
                        style={{
                            //marginTop: 2 * CONTAINER_VERTICAL_MARGIN,
                        }}
                    ></BackgroundTitle>
                    <NavigationGroup
                        navigation={this.props.navigation}
                        style={{
                            marginBottom: 0
                        }}
                        rows={[
                            { text: "Tasks Remaining"
                            , number: 4
                            , navParams: {}
                            , navDestination: "RemainingTasks"
                            },
                            { text: "Overdue"
                            , number: 2
                            , navParams: {}
                            , navDestination: "Overdue"
                            },
                            { text: "Goals In Progress"
                            , number: 1
                            , navParams: {}
                            , navDestination: "InProgressGoals"
                            },
                            { text: "Rewards Earned"
                            , number: 5
                            , navParams: {}
                            , navDestination: "EarnedRewards"
                            },
                            { text: "Penalty Pending"
                            , number: 1
                            , navParams: {}
                            , navDestination: "EarnedPenalties"
                            },
                        ]}
                    >
                    </NavigationGroup>

                    <RowView
                        style={{
                            justifyContent: "flex-start",
                            backgroundColor: PRIMARY_COLOR_LIGHT,
                            paddingRight: RIGHT_SECOND_MARGIN,
                        }}
                    >
                        <BackgroundTitle title={"Lists"}
                            style={{
                                marginTop: 2 * CONTAINER_VERTICAL_MARGIN,
                                alignSelf: "flex-end",
                            }}
                        ></BackgroundTitle>
                        <RowReverseView
                            style={[{
                                backgroundColor: PRIMARY_COLOR_LIGHT,
                            }, Styles.CENTERED_SECONDARY]}
                        >
                            <ModalIconButton type={"more"}
                                data={{
                                    showModal: this.state.showMore
                                }}
                                onDataChange={({ showModal }) => {
                                    this.setState({
                                        showMore: showModal
                                    })
                                }}
                            >
                                <ModalRow
                                    text={"Add Goal"}
                                    iconType={"complete"}
                                    onPress={() => {
                                        this.setState({
                                            showMore: false,
                                        })
                                    }}
                                ></ModalRow>
                            </ModalIconButton>
                            <IconButton type={"settings"}
                                onPress={() => {
                                    this.props.navigation.navigate("Settings")
                                }} 
                            >
                            </IconButton> 
                            <ModalIconButton type={"add"}
                                data={{
                                    showModal: this.state.showAdd
                                }}
                                onDataChange={({ showModal }) => {
                                    this.setState({
                                        showAdd: showModal
                                    })
                                }}
                            >
                                <ModalRow
                                    text={"Goal"}
                                    iconType={"goal"}
                                    iconBackground={"white"}
                                    onPress={() => {
                                        this.props.navigation.navigate("AddGoal")
                                        this.setState({
                                            showAdd: false,
                                        })
                                    }}
                                ></ModalRow>
                                <ModalRow
                                    text={"Task"}
                                    iconType={"task"}
                                    iconBackground={"white"}
                                    onPress={() => {
                                        this.props.navigation.navigate("AddTask")
                                        this.setState({
                                            showAdd: false,
                                        })
                                    }}
                                ></ModalRow>
                                <ModalRow
                                    text={"Reward"}
                                    iconType={"reward"}
                                    iconBackground={"white"}
                                    onPress={() => {
                                        this.props.navigation.navigate("AddReward")
                                        this.setState({
                                            showAdd: false,
                                        })
                                    }}
                                ></ModalRow>
                                <ModalRow
                                    text={"Penalty"}
                                    iconType={"penalty"}
                                    iconBackground={"white"}
                                    onPress={() => {
                                        this.props.navigation.navigate("AddPenalty")
                                        this.setState({
                                            showAdd: false,
                                        })
                                    }}
                                ></ModalRow>
                            </ModalIconButton>
                        </RowReverseView>
                    </RowView>
                    <NavigationGroup
                        navigation={this.props.navigation}
                        style={{
                            marginBottom: ROW_HEIGHT + 20,
                        }}
                        rows={[
                            { text: "Goals"
                            , number: 4
                            , navParams: {}
                            , navDestination: "Goals"
                            },
                            { text: "Tasks"
                            , number: 2
                            , navParams: {}
                            , navDestination: "Tasks"
                            },
                            { text: "Rewards"
                            , number: 1
                            , navParams: {}
                            , navDestination: "Rewards"
                            },
                            { text: "Penalties"
                            , number: 5
                            , navParams: {}
                            , navDestination: "Penalties"
                            },
                        ]}
                    >
                    </NavigationGroup>
                </ScrollView>
            </DocumentView>
        );
    }
}