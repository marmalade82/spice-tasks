
import React from "react";

import { View, StyleProp, ViewStyle } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, RowReverseView } from "src/Components/Basic/Basic";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
    number: number;
    text: string;
    onPress?: () => void;
    key?: any;
    rightElements: (() => JSX.Element)[]
    style?: StyleProp<ViewStyle>
}

export default class ClickRow extends React.Component<Props> {

    constructor(props: Props ) {
        super(props);
    }

    render = () => {
            return (
                <View
                    style={[{
                        flexDirection: "column",
                        flex: 0,
                        height: 62,
                        width: "100%",
                        //marginBottom: 10,
                        backgroundColor: "white",
                        //elevation: 5,
                        justifyContent: "center",
                        alignItems: "stretch"
                    }, this.props.style]}
                >
                    {this.renderContent()}
                </View>
            );
    }

    renderContent = () => {
        if(this.props.onPress) {
            //return this.renderRow();
            
            return (
                    <TouchableOpacity
                        style={{
                            flex: 0,
                            height: 60,
                            width: "100%",
                            backgroundColor: "white",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "stretch",
                            marginLeft: 0,
                        }}
                        onPress={this.props.onPress}
                    >
                        {this.renderRow()}
                    </TouchableOpacity>
            );
            
        } else {
            return this.renderRow();
        }

    }
    
    renderRow = () => {
        return (
                <RowView style={{
                    flex: 1,
                    height: 60,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "stretch",
                    paddingLeft: 15,
                    paddingRight: 15,
                }}>
                    <RowView style={{
                        alignItems: "center",
                        justifyContent: "flex-start",
                        backgroundColor: "white",
                    }}>
                        <View style={{
                            height: 37,
                            width: 37,
                            borderRadius: 37/2,
                            backgroundColor: "rgb(191,38,0)",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <HeaderText level={3} style={{
                                color: "white",
                            }}>
                                { this.props.number }
                            </HeaderText>
                        </View>
                        <HeaderText level={3} style={{
                            margin: 15,
                            marginLeft: 9,
                        }}>
                            {this.props.text}
                        </HeaderText>

                    </RowView>
                    <RowReverseView style={{
                        flex: 0, // this takes up as much as space as what it contains.
                        justifyContent: "flex-start",
                        alignItems: "center",
                        backgroundColor: "white",
                    }}>
                        { this.renderRightElements() }
                    </RowReverseView>
                </RowView>
        )
    }
    renderRightElements = () => {
        return this.props.rightElements.map((el) => {
            return (
                el()
            )
        })
    }
}