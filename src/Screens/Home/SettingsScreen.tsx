import React from "react";
import { ScrollView, View, StyleProp, ViewStyle } from "react-native";
import { 
    NavigationRow, ScreenHeader, DocumentView, 
    NavigationGroup, BackgroundTitle, Summary, Modal ,
} from "src/Components/Styled/Styled";
import { ColorPicker, TriangleColorPicker, HsvColor, toHsv, fromHsv } from "react-native-color-picker";

import { MainNavigator, ScreenNavigation, FullNavigation } from "src/common/Navigator";
import { TouchableView, HeaderText, BodyText } from "src/Components/Basic/Basic";
import GlobalQuery, { GlobalLogic } from "src/Models/Global/GlobalQuery";
import Default from "src/Components/Styled/Styles";
import Global from "src/Models/Global/Global";
import { isBuffer } from "util";

interface Props {
    navigation: object;
}

interface State {
    primaryColor: string;
    secondaryColor: string;
    primaryLightColor: string;
    global: Global | undefined;
}

export default class SettingsScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Settings',
        }
    }
    
    unsub: () => void;
    navigation: MainNavigator<"Settings">
    constructor(props: Props) {
        super(props);

        this.state = {
            primaryColor: "white",
            secondaryColor: "white",
            primaryLightColor: "white",
            global: undefined,
        }

        this.unsub = () => {};
        this.navigation = new ScreenNavigation(this.props);
    }

    componentDidMount = async () => {
        // Subscribe to the themes
        const globalRecord = await new GlobalQuery().current();
        const globalSub = globalRecord.observe().subscribe((global) => {
            this.setState({
                primaryColor: global.primaryColor ? global.primaryColor : Default.PRIMARY_COLOR,
                secondaryColor: global.secondaryColor ? global.secondaryColor : Default.SECONDARY_COLOR,
                primaryLightColor: global.primaryLightColor ? global.primaryLightColor : Default.PRIMARY_COLOR_LIGHT,
                global: global,
            })
        })

        this.unsub = () => {
            globalSub.unsubscribe();
        }
    }

    componentWillUnmount = () => {
        this.unsub();
    }

    private saveTheme = () => {
        setTimeout(() => {
            if(this.state.global !== undefined) {
                const update = {
                    primaryColor: this.state.primaryColor,
                    secondaryColor: this.state.secondaryColor,
                    primaryLightColor: this.state.primaryLightColor,
                }

                void new GlobalQuery().update(this.state.global, update);
            }
        }, 100)

    }

    private restoreDefault = () => {
        setTimeout(() => {
            if(this.state.global !== undefined) {
                const query = new GlobalQuery();
                const update = {
                    primaryColor: query.default().primaryColor,
                    secondaryColor: query.default().secondaryColor,
                    primaryLightColor: query.default().primaryLightColor,
                }
                void query.update(this.state.global, update);
            }
        }, 100)
    }

    render = () => {
        return (
            <DocumentView accessibilityLabel={"lists"}>
                <View
                    style={{
                        marginHorizontal: 20,
                        marginVertical: 10,
                        borderRadius: 15,
                        backgroundColor: "white",
                    }}
                >
                    <HeaderText style={{
                        marginVertical: 10,
                        marginHorizontal: 10,
                    }} level={3}>Theme</HeaderText>
                    <ColorInput
                        color={this.state.primaryColor}
                        onSelectColor={(color) => {
                            this.setState({
                                primaryColor: color
                            })
                            this.saveTheme();
                        }}
                        label={"Primary"}
                    ></ColorInput>
                    <ColorInput
                        color={this.state.primaryLightColor}
                        onSelectColor={(color) => {
                            this.setState({
                                primaryLightColor: color
                            })
                            this.saveTheme();
                        }}
                        label={"Primary Light"}
                        style={{
                        }}
                    ></ColorInput>
                    <ColorInput
                        color={this.state.secondaryColor}
                        onSelectColor={(color) => {
                            this.setState({
                                secondaryColor: color
                            })
                            this.saveTheme();
                        }}
                        label={"Secondary"}
                        style={{
                        }}
                    ></ColorInput>
                    <ConfirmActionInput
                        label={"Restore Defaults"}
                        warning={"You'll lose your current theme."}
                        onConfirm={() => {
                            this.restoreDefault();
                        }}
                    ></ConfirmActionInput>
                </View>
            </DocumentView>
        )
    }

}

interface ColorProps {
    color: string;
    onSelectColor: (color: string) => void;
    label: string;
    style?: StyleProp<ViewStyle>
}

interface ColorState {
    showColor: boolean;
    color: HsvColor;
}

class ColorInput extends React.Component<ColorProps, ColorState>{

    constructor(props: ColorProps) {
        super(props);

        this.state = {
            color: toHsv(this.props.color),
            showColor: false,
        } 
    }

    render = () => {
        return (
            <TouchableView style={[{
                    backgroundColor: "transparent",
                    height: 50,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 3,
                    marginHorizontal: 10,
                    borderColor: "lightgrey",
                    borderWidth: 0,
                    borderTopWidth: 1,
                    borderBottomWidth: 0,
                }, this.props.style]}
                onPress={() => {
                    this.setState({
                        showColor: true,
                    })
                }}
            >
                <BodyText style={{}}>
                    {this.props.label}
                </BodyText>
                <View
                    style={{
                        height: 20,
                        width: 20,
                        backgroundColor: this.props.color,
                        borderColor: "black",
                        
                        borderBottomWidth: 1,
                        borderRightWidth: 1,
                    }}
                ></View>
                <Modal
                    visible={this.state.showColor}
                    onRequestOpen={() => {
                        this.setState({
                            color: toHsv(this.props.color)
                        })
                    }}
                    onRequestClose={() => {
                        this.setState({
                            showColor: false,
                        })
                    }}
                >
                    <TriangleColorPicker
                        color={this.state.color}
                        defaultColor={"white"}
                        onColorSelected = {(selected) => {
                            this.setState({
                                showColor: false,
                            })

                            this.props.onSelectColor(selected);
                        }}
                        onColorChange = {(selected) => {
                            this.setState({
                                color: selected
                            })
                        }}
                        oldColor={this.props.color}
                        onOldColorSelected={(selected) => {
                            this.setState({
                                showColor: false,
                                color: toHsv(this.props.color),
                            })

                            this.props.onSelectColor(selected);
                        }}
                        style={{
                            /**
                             * TODO: This probably needs to be related to dimensions...
                             */
                            height: 350,
                            marginHorizontal: 10,
                            marginVertical: 20,
                        }}
                    ></TriangleColorPicker>
                </Modal>
            </TouchableView>
        )
    }
}

interface ConfirmActionProps {
    label: string;
    warning: string;
    onConfirm: () => void;
    style?: StyleProp<ViewStyle>;
}

interface ConfirmActionState {
    showConfirm: boolean
}

class ConfirmActionInput extends React.Component<ConfirmActionProps, ConfirmActionState> {
    constructor(props: ConfirmActionProps) {
        super(props);
        this.state = {
            showConfirm: false,
        }
    }

    render = () => {
        return (
            <TouchableView style={[{
                    backgroundColor: "transparent",
                    height: 50,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 3,
                    marginHorizontal: 10,
                    borderColor: "lightgrey",
                    borderWidth: 0,
                    borderTopWidth: 1,
                    borderBottomWidth: 0,
                }, this.props.style]}
                onPress={() => {
                    this.setState({
                        showConfirm: true,
                    })
                }}
            >
                <BodyText style={{}}>
                    {this.props.label}
                </BodyText>
                <Modal
                    visible={this.state.showConfirm}
                    onRequestClose={() => {
                        this.setState({
                            showConfirm: false,
                        })
                    }}
                >
                    <React.Fragment>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "stretch",
                            }}
                        >
                            <HeaderText level={2} style={{
                                marginVertical: 10,
                            }}>Are you sure?</HeaderText>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "stretch",
                            }}
                        >
                            <BodyText style={{}}>{this.props.warning}</BodyText>
                        </View>
                        <View
                            style={{
                                marginTop: 15,
                                flexDirection: "row",
                            }}
                        >
                            <TouchableView style={{
                                flex: 1,
                                justifyContent: "center",
                                marginHorizontal: 10,
                                alignItems: "center",
                                paddingVertical: 10,
                                borderRadius: 10,
                                backgroundColor: "darkgreen",
                            }}
                                onPress={() => {
                                    this.setState({
                                        showConfirm: false,
                                    })

                                    this.props.onConfirm();
                                }}
                            >
                                <HeaderText level={3} style={{
                                    color: "white",
                                }}>Yes</HeaderText>
                            </TouchableView>
                            <TouchableView style={{
                                flex: 1,
                                marginHorizontal: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 10,
                                backgroundColor: "red",
                            }}
                                onPress={() => {
                                    this.setState({
                                        showConfirm: false,
                                    })
                                }}
                            >
                                <HeaderText level={3} style={{
                                    color: "white",
                                }}>No</HeaderText>
                            </TouchableView>
                        </View>
                    </React.Fragment>
                </Modal>
            </TouchableView>
        )
    }
}