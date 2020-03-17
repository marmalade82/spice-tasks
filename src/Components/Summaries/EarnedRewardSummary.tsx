import React from "react";
import { View, StyleProp, ViewStyle, Text } from "react-native";
import Style from "src/Style/Style";
import { RowView, ColumnView, Image, HeaderText, BodyText } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { Summary, IconButton } from "src/Components/Styled/Styled";
import { Navigation, ScreenParams } from "src/common/Navigator";


interface Props {
    style: StyleProp<ViewStyle>
    rewardType: "two_dice" | "lootbox" | "coin_flip" | "spin_wheel" | "specific"
    goalName: string;
    title: string;
    details: string;
    earnedDate: Date
    navigation: Navigation<ScreenParams>;
    onChoice: OnChoice;
    active: boolean;
}

export type OnChoice = (choice: "use") => void;

interface State {

}

export default class EarnedRewardSummary extends React.Component<Props, State> {
    
    getImageProps = () => {
        const getImageSource = () => {
            if(this.props.rewardType === "two_dice") {
                return require("assets/images/dice.jpg");
            }

            return require("assets/images/dice.jpg");
        }

        const getImageLabel = () => {
            if(this.props.rewardType === "two_dice") {
                return "dice";
            }

            return "dice";
        }

        return {
            source: getImageSource(),
            accessibilityLabel: getImageLabel(),
        }
    }

    getHeaderText = () => {
        if(this.props.rewardType === "two_dice") {
            return "Dice Roll";
        }

        return "Dice Roll";
    }

    getFooterElements = () => {
        if(this.props.active) {
            return [
                () => { 
                    return (
                        <IconButton type={"complete"}
                            onPress={() => {
                                this.props.onChoice("use");
                            }}
                            accessibilityLabel={"use-reward-button"}
                            key={"complete"}
                        ></IconButton>
                    );
                },
            ]
        } else {
            return [

            ];
        }
    }

    render = () => {
        const { title, details} = this.props;
        return (
            <Summary
                style={{}}
                headerText={title}
                bodyText={() => {
                    return (
                        <Text>
                            <BodyText
                                style={{}}
                            >
                                {details}
                            </BodyText>
                        </Text>
                    );
                }}
                footerElements={ this.getFooterElements() }
            >

            </Summary>
        )

        return (
            <RowView 
                style={[this.props.style]}
                accessibilityLabel={"earned-reward-summary"}
            >
                <ColumnView style={[Style.blueBg, {
                    flex: 0,
                    width: 120,
                    alignItems: "center",
                }]}>
                    <View 
                        style={{
                            flex: 0,
                            height: 75,
                            width: 75,
                            borderRadius: 75/2,
                            justifyContent: "center",
                            alignItems: "stretch",
                            backgroundColor: "lightyellow",
                        }}
                        accessibilityLabel={"earned-reward-icon"}
                    >
                        <Image
                            style={{
                                resizeMode: "cover",
                                borderRadius: 75/2,
                            }}
                            {...this.getImageProps()}
                        ></Image>
                    </View>
                </ColumnView>
                <ColumnView style={[Style.greenBg]}>
                    <HeaderText style={{}} level={3}
                        accessibilityLabel={"earned-reward-type"} 
                    >
                        { this.getHeaderText() }
                    </HeaderText>
                    <BodyText style={{}}>
                        For completing 
                            <HeaderText style={{}} level={4} accessibilityLabel={"earned-reward-goal"}>
                                {" " + this.props.goalName }
                            </HeaderText> on 
                        <BodyText style={{}} accessibilityLabel={"earned-reward-earned-date"}>
                            {" " + new MyDate(this.props.earnedDate).format("dddd, MMMM Do") }
                        </BodyText>
                    </BodyText>
                </ColumnView>
            </RowView>
        )
    }
}