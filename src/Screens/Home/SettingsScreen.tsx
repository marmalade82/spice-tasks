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
import { LabelValue } from "src/common/types";
import { StyleSheetContext } from "src/Components/Styled/StyleSheets";

interface Props {
    navigation: object;
}

interface State {
    primaryColor: string;
    secondaryColor: string;
    primaryLightColor: string;
    defaultReminder: string;
    global: Global | undefined;
}

export default class SettingsScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Settings',
        }
    }

    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    
    unsub: () => void;
    navigation: MainNavigator<"Settings">
    constructor(props: Props) {
        super(props);

        this.state = {
            primaryColor: "white",
            secondaryColor: "white",
            primaryLightColor: "white",
            defaultReminder: "no",
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
                defaultReminder: global.remindMe ? "yes" : "no",
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

    private saveNotifications = () => {
        setTimeout(() => {
            if(this.state.global !== undefined) {
                const update = {
                    remindMe: this.state.defaultReminder === "yes" ? true : false,
                }

                void new GlobalQuery().update(this.state.global, update);
            }
        }, 100)
    }

    render = () => {
        return (
            <DocumentView accessibilityLabel={"lists"}>
                <Panel
                    label={"Theme"}
                >
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
                </Panel>
                <Panel
                    label={"Notifications"}
                >
                    <ChoiceInput
                        label={"Default Task Reminder?"}
                        value={this.state.defaultReminder}
                        choices={[
                            {label: "No", value: "no", key: "no"},
                            {label: "Yes", value: "yes", key: "yes"},
                        ]}
                        onChange={(value) => {
                            this.setState({
                                defaultReminder: value
                            })
                            this.saveNotifications();
                        }}
                    ></ChoiceInput>
                </Panel>
            </DocumentView>
        )
    }
}


interface PanelProps {
    label: string;
}
interface PanelState {}

class Panel extends React.Component<PanelProps, PanelState> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: PanelProps) {
        super(props);
    }

    render = () => {
        const { Custom, Class, Common } = this.context;
        return (
            <View
                style={Class.Panel_Container}
            >
                <HeaderText style={Class.Panel_Header} level={3}>{this.props.label}</HeaderText>
                {this.props.children}
            </View>
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

    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: ColorProps) {
        super(props);

        this.state = {
            color: toHsv(this.props.color),
            showColor: false,
        } 
    }

    render = () => {

        const { Custom, Class, Common } = this.context;
        return (
            <TouchableView style={[Class.SettingsColorInput_Container, this.props.style]}
                onPress={() => {
                    this.setState({
                        showColor: true,
                    })
                    this.setState({
                        color: toHsv(this.props.color)
                    })
                }}
            >
                <BodyText style={{}}>
                    {this.props.label}
                </BodyText>
                <View
                    style={[Class.SettingsColorInput_Color, {
                        backgroundColor: this.props.color
                    }]}
                ></View>
                <Modal
                    visible={this.state.showColor}
                    onRequestOpen={() => {
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
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: ConfirmActionProps) {
        super(props);
        this.state = {
            showConfirm: false,
        }
    }

    render = () => {
        const { Custom, Class, Common } = this.context;
        return (
            <TouchableView style={[Class.ConfirmActionInput_Container, this.props.style]}
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

interface ChoiceProps {
    label: string;
    value: string;
    choices: LabelValue[];
    onChange: (value: string) => void;
    style?: StyleProp<ViewStyle>
}

interface ChoiceState {
    showChoices: boolean;
}

class ChoiceInput extends React.Component<ChoiceProps, ChoiceState> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: ChoiceProps) {
        super(props);
        this.state = {
            showChoices: false,
        }
    }

    render = () => {

        const { Custom, Class, Common } = this.context;
        return (
            <TouchableView style={[Class.SettingsChoiceInput_Container, this.props.style]}
                onPress={() => {
                    this.setState({
                        showChoices: true,
                    })
                }}
            >
                <BodyText style={{}}>
                    {this.props.label}
                </BodyText>
                <View
                    style={{
                        marginRight: 10,
                        backgroundColor: "transparent",
                    }}
                >
                    <BodyText style={{}}>
                        {this.getCurrentLabel()}
                    </BodyText>
                </View>
                <Modal
                    visible={this.state.showChoices}
                    onRequestOpen={() => {
                    }}
                    onRequestClose={() => {
                        this.setState({
                            showChoices: false,
                        })
                    }}
                    contentStyle={{
                        paddingHorizontal: 15,
                    }}
                >
                    {this.renderChoices()}
                </Modal>
            </TouchableView>
        )
    }

    private getCurrentLabel = () => {
        const lv = this.props.choices.find((lv) => {
            return lv.value === this.props.value;
        })

        if(lv !== undefined) {
            return lv.label;
        }

        return "";
    }

    private renderChoices = () => {
        const { Custom, Class, Common } = this.context;
        return this.props.choices.map((lv, index) => {
            return (
                <View key={lv.key}
                    style={{
                        ...Class.SettingsChoiceInput_ChoiceContainer,
                        borderBottomWidth: index === this.props.choices.length - 1 ? 0 : 1,
                    }}
                >
                    <TouchableView style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                        onPress={() => {
                            this.props.onChange(lv.value)
                            this.setState({
                                showChoices: false,
                            })
                        }}
                    >
                        <View
                            style={{
                                ...Class.SettingsChoiceInput_ChoiceIndicator,
                                ...(lv.value !== this.props.value && { backgroundColor: "transparent"})
                            }}
                        ></View>
                        <BodyText style={{
                            marginVertical: 10,
                            marginLeft: 20,
                        }}>
                            {lv.label}
                        </BodyText>
                    </TouchableView>
                </View>
            )
        })
    }
}