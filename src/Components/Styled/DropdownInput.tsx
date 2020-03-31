import React from "react";
import { View, ViewStyle, StyleProp, Button } from "react-native";
import { BodyText, TouchableView } from "../Basic/Basic";
import { TEXT_VERTICAL_MARGIN, TEXT_HORIZONTAL_MARGIN, BORDER_GREY, BACKGROUND_GREY, MODAL_ROW_HEIGHT } from "./Styles";

interface LabelValue<Choices> {
    label: string;
    value: Choices;
    key: string;
}

interface Props<Choices> {
    choices: LabelValue<Choices>[]
    onPick: (choice: Choices) => void;
    pick: Choices
    style?: StyleProp<ViewStyle>
    accessibilityLabel: string;
}

interface State {
    display: "none" | "flex"
}

const height = MODAL_ROW_HEIGHT - 8;
const width = 90;

export class DropdownInput<Choices> extends React.Component<Props<Choices>, State> {
    constructor(props: Props<Choices>) {
        super(props);

        this.state = {
            display: "none",
        };
    }


    render = () => {
        return (
                <View
                    style={{
                        flex: 0,
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        backgroundColor: "transparent",
                    }}
                    accessibilityLabel={""}
                >
                    <BodyText style={{}}>3 </BodyText>


                    <View
                        style={{ 
                            flex: 0,
                            justifyContent: "flex-end",
                            alignItems: "stretch",
                            height: height,
                            width: width,
                            backgroundColor: "transparent",
                        }}
                    >
                        {/*this.renderAbsoluteChoices()*/}
                        {this.renderChoices()}
                        <TouchableView
                            style={{
                                flex: 0,
                            }}
                            onPress = {() => {
                                this.setState((prevState) => {
                                    if(prevState.display === "none") {
                                        return {
                                            display: "flex",
                                        }
                                    } else {
                                        return {
                                            display: "none",
                                        }
                                    }
                                })
                            }}
                            accessibilityLabel={this.props.accessibilityLabel}
                        >
                            <View
                                style={[{
                                    flex: 0, 
                                    paddingHorizontal: TEXT_HORIZONTAL_MARGIN,
                                    backgroundColor: BACKGROUND_GREY,
                                    borderColor: BORDER_GREY,
                                    //borderWidth: 1,
                                    //borderRadius: 5,
                                    height: height,
                                    width: width,
                                    justifyContent: "center",
                                    alignItems: "stretch",
                                }, this.props.style]}
                            >
                                <BodyText
                                    style={{}}
                                >
                                    {this.renderCurrent()}
                                </BodyText>
                            </View>
                        </TouchableView>
                    </View>
                </View>
        );
    }

    private renderCurrent = () => {
        let found = this.props.choices.find((choice) => {
            return choice.value === this.props.pick;
        })

        if(found) {
            return found.label;
        } else {
            return "";
        }
    }

    private renderAbsoluteChoices = () => {
        return (
            <View
                style={{
                    flex: 0,
                    position: "absolute",
                    //top: height,
                    //bottom: height * 2,
                    display: this.state.display,
                    width: width,
                    zIndex: 1000,
                    backgroundColor: BACKGROUND_GREY,
                }}
            >
                { this.renderChoices() }
            </View>
        )
    }

    private renderChoices = () => {
        return this.props.choices.map((choice, index) => {
            return (<Button
                title={"hi"}
                onPress={() => {}}
            ></Button>)
            return ( 
                <View
                    style={{
                        flex: 0,
                        position: "relative",
                        height: height,
                        width: width,
                    }}
                    pointerEvents={"box-none"}
                >

                    <TouchableView
                        style={{ 
                            flex: 0,
                            zIndex: 1000,
                            position: "relative",
                        }}
                        onPress={() => {}}
                    >
                        <View
                            style={{
                                flex: 0,
                                paddingHorizontal: TEXT_HORIZONTAL_MARGIN,
                                backgroundColor: BACKGROUND_GREY,
                                borderColor: BACKGROUND_GREY,
                                height: height,
                                justifyContent: "center",
                                alignItems: "stretch",
                                width: width,
                                zIndex: 1000,
                            }}
                        >
                            <BodyText
                                style={{}}
                            >
                            {choice.label}
                            </BodyText>
                        </View>
                    </TouchableView>
                </View>
            );
        })
    }
}
