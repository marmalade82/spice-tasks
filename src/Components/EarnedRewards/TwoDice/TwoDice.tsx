import React from "react";
import { 
    ColumnView, RowView, Image, 
    HeaderText, BodyText, ViewWizard 
} from "src/Components/Basic/Basic";
import { Button, Text, View, FlatList, StyleProp, ViewStyle} from "react-native";
import TwoDiceRoll from "src/Components/EarnedRewards/TwoDice/TwoDiceRoll";
import { random } from "src/common/random";

interface Props { 
    style: StyleProp<ViewStyle>
    controlHeight?: number;
    accessibilityLabel: string;
    rewardChoices: RewardChoice[];
    onComplete: ( result: { reward?: string; penalty?: string }) => void;
}

interface State  { }

interface RewardChoice {
    key: string;
    text: string;
    number: string;
    rewardId?: string;
    penaltyId?: string;
}

export default class TwoDice extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    onRollComplete = (num: number) => {
        const choice = this.props.rewardChoices.find( (r: RewardChoice) => {
            return r.number === num.toString()
        })

        if(choice) {
            this.props.onComplete({
                reward: choice.rewardId,
                penalty: choice.penaltyId,
            })
        } else {
            this.props.onComplete({
                reward: undefined,
                penalty: undefined,
            })
        }
    }

    render = () => {
        return (
            <ViewWizard
                accessibilityLabel={this.props.accessibilityLabel}
                style={[this.props.style]}
                allowSwiping={false}
                useButtons={true}
                wizardPlacement={"footer"}
                data={false}
                onDataChange={() => {}}
                views={this.renderViews()}
                wizardHeight={this.props.controlHeight}
            >

            </ViewWizard>
        );
    }

    renderViews = () => {
        return [
            () => {
                return (
                    <ColumnView style={{}}>
                        <FlatList
                            style={{
                                width: "100%",
                                backgroundColor: "pink"
                            }}
                            data={ this.props.rewardChoices } 
                            renderItem={({item}) => {
                                return (
                                    <ColumnView style={{
                                        backgroundColor: "purple",
                                    }}>
                                        <RowView style={{
                                            backgroundColor: "brown"
                                        }}>
                                            <ColumnView style={{
                                                backgroundColor: "pink",
                                                flex: 0,
                                                width: 80,
                                                alignItems: "center",
                                            }}>
                                                <View style={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: 30,
                                                    backgroundColor: "lightgreen",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}>
                                                    <BodyText style={{}}>{item.number}</BodyText>
                                                </View>
                                            </ColumnView>
                                            <ColumnView style={{
                                                alignItems: "flex-start",
                                            }}>
                                                <BodyText style={{}}>{item.text}</BodyText>
                                            </ColumnView>
                                        </RowView>
                                    </ColumnView>
                                );
                            }}
                        >

                        </FlatList>
                    </ColumnView>
                );
            },
            () => {
                return (
                    <TwoDiceRoll
                        onRollComplete={this.onRollComplete}
                    ></TwoDiceRoll>
                )
            },
            () => {
                return (
                    <ColumnView style={{}}><Text>Hi 3</Text></ColumnView>
                )
            },
        ];
    }
}

export {
    RewardChoice
}