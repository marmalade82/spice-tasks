import React from "react";
import { View, ViewStyle, StyleProp, Button, Modal } from "react-native";
import { BodyText, TouchableView } from "../Basic/Basic";
import { TEXT_VERTICAL_MARGIN, TEXT_HORIZONTAL_MARGIN, BORDER_GREY, BACKGROUND_GREY, MODAL_ROW_HEIGHT } from "./Styles";
import { TouchableWithoutFeedback, findNodeHandle } from "react-native";
import Dropdown from "src/Components/Styled/Dropdown";
//import {DropdownInput as Dropdown} from "src/Components/Styled/DropDown";


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
    backgroundColor: string,
    visible: boolean;
    display: "none" | "flex",
}

const height = MODAL_ROW_HEIGHT - 8;
const width = 120;

export class DropdownInput<Choices> extends React.Component<Props<Choices>, State> {
    viewRef: React.RefObject<View>
    touchRef: React.RefObject<TouchableView>
    constructor(props: Props<Choices>) {
        super(props);

        this.state = {
            display: "none",
            backgroundColor: "green",
            visible: false,
        };

        this.viewRef = React.createRef<View>()
        this.touchRef = React.createRef()
    }

    componentDidMount = () => {
        //let node = findNodeHandle(BodyText);
        if(this.viewRef.current) {
            //this.viewRef.current.measureLayout(node, onSuccess, () => {})
        }

        function onSuccess(left: number, top: number, width: number, height: number) {
            let results = {left, top, width, height}
            console.log("RESULTS: " + results);
        }
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

                    {this.renderAbsoluteChoices()}

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
            <Dropdown
                height={height}
                width={width}
                choices={["days", "weeks", "months"]}
                current={"weeks"}
                onChange={(val: any) => {

                }}
            >

            </Dropdown>
        )
        return (
            <View
                style={{
                    flex: 0,
                    position: "absolute",
                    //top: height,
                    bottom: height,
                    //display: this.state.display,
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
            return ( 
                <View
                    style={{
                        flex: 0,
                        position: "relative",
                        height: height,
                        width: width,
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setState({
                                backgroundColor: "pink",
                            })
                        }}
                    >
                        <TouchableView
                            style={{ 
                                flex: 0,
                                zIndex: 1000,
                                position: "relative",
                            }}
                            onPress={() => {}}
                            ref={this.touchRef}
                        >
                            <View
                                style={{
                                    flex: 0,
                                    paddingHorizontal: TEXT_HORIZONTAL_MARGIN,
                                    backgroundColor: this.state.backgroundColor, //BACKGROUND_GREY,
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
                    </TouchableWithoutFeedback>
                </View>
            );
        })
    }
}
