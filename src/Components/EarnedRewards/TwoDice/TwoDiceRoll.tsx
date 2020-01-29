import React from "react";
import { Button, Text, View, FlatList, Animated, StyleProp, ViewStyle, Easing } from "react-native";

import { 
    ColumnView, RowView, Image, 
    HeaderText, BodyText, ViewWizard 
} from "src/Components/Basic/Basic";
import {
    Die 
} from "src/Components/Images/Images";
import { random } from "src/common/random";

interface Props {
    onRollComplete: (num: number) => void;
}

interface State {
    dieOne: number,
    dieOnePhase: boolean,
    runningDieOne: boolean
    dieTwo: number,
    dieTwoPhase: boolean,
    runningDieTwo: boolean
}

export default class TwoDiceRoll extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            dieOne: (Math.floor(Math.random() * 100) % 6) + 1,
            dieOnePhase: false,
            runningDieOne: false,
            dieTwo: (Math.floor(Math.random() * 100) % 6) + 1,
            dieTwoPhase: false,
            runningDieTwo: false,
        }
    }

    rollDieOne = () => {
        debugger;
        this.setState({
            runningDieOne: true,
        });
        (() => {
            let count = 0;
            let id = setInterval(() => {
                count += 1;
                const roll = random(2, 12);
                this.setState({
                    dieOne: roll,
                    dieOnePhase: count % 2 === 1
                })

                if(count >= 4) {
                    clearInterval(id);
                    debugger;
                    this.props.onRollComplete(roll);
                }
            }, 900)
        })();
    }

    rollDieTwo = () => {
        this.setState({
            runningDieTwo: true,
        });
        (() => {
            let totalSec = 0;
            let id = setInterval(() => {
                totalSec += 1;
                this.setState({
                    dieTwo: (Math.floor(Math.random() * 100) % 6) + 1,
                    dieTwoPhase: totalSec % 2 === 1
                })

                if(totalSec >= 4) {
                    clearInterval(id);
                }
            }, 1000)
        })();
    }

    render = () => {
        return (
                    <ColumnView accessibilityLabel={"roll-dice"} style={{}}>
                        <RowView style={{ backgroundColor: "pink" }}>
                            <ColumnView style={{ alignItems: "center" }}>
                                <Button title={"Roll"} onPress={this.rollDieOne}
                                    accessibilityLabel={"input-claim-button"}
                                    disabled={this.state.runningDieOne} 
                                ></Button>
                            </ColumnView>
                            <ColumnView style={{ alignItems:  this.state.dieOnePhase ? "flex-start" : "center"}}>
                                <View
                                    style={[{
                                        height:"40%",
                                        width: "40%",
                                    }]}
                                >
                                    <Die number={this.state.dieOne}>
                                    </Die>
                                </View>
                            </ColumnView>
                        </RowView>
                        <RowView style={{}}>
                            <ColumnView style={{ alignItems: "center" }}>
                                <Button title={"Roll"} onPress={this.rollDieTwo}
                                    disabled={this.state.runningDieTwo} 
                                ></Button>
                            </ColumnView>
                            <ColumnView style={{ alignItems: this.state.dieTwoPhase ? "flex-start" : "center"}}>
                                <View
                                    style={{
                                        height: "40%",
                                        width: "40%",
                                    }}
                                >
                                    <Die number={this.state.dieTwo}>
                                    </Die>
                                </View>
                            </ColumnView>
                        </RowView>
                    </ColumnView>
        );
    }
}

interface RollProps {
    style: StyleProp<ViewStyle>;
    running: boolean;
    onRollComplete: (val: number) => void;
}

interface RollState {
    number: number,
    phase: boolean,
}

class DieRoll extends React.Component<RollProps, RollState> {
    constructor(props: RollProps) {
        super(props);

        this.state = {
            number: (Math.floor(Math.random() * 100) % 6) + 1,
            phase: false,
        }
    }


    render = () => {
        return (
            <View
                style={[this.props.style]}
            >
                <Die number={1}>
                </Die>
            </View>
        );
    }
}

const AnimatedDieRoll = Animated.createAnimatedComponent(DieRoll);