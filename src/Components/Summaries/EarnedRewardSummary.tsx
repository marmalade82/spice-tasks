import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import Style from "src/Style/Style";
import { RowView, ColumnView, Image, HeaderText, BodyText } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";


interface Props {
    style: StyleProp<ViewStyle>
    rewardType: "two_dice" | "lootbox" | "coin_flip" | "spin_wheel" | "specific"
    goalName: string
    earnedDate: Date
}

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


    render = () => {
        return (
            <RowView style={[this.props.style]}>
                <ColumnView style={[Style.blueBg, {
                    flex: 0,
                    width: 120,
                    alignItems: "center",
                }]}>
                    <View style={{
                        flex: 0,
                        height: 75,
                        width: 75,
                        borderRadius: 75/2,
                        justifyContent: "center",
                        alignItems: "stretch",
                        backgroundColor: "lightyellow",
                    }}>
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
                    <HeaderText style={{}} level={3}>
                        { this.getHeaderText() }
                    </HeaderText>
                    <BodyText style={{}}>
                        For completing <HeaderText style={{}} level={4}>{this.props.goalName}</HeaderText> on 
                        {" " + new MyDate(this.props.earnedDate).format("dddd, MMMM Do")}.
                    </BodyText>
                </ColumnView>
            </RowView>
        )
    }
}