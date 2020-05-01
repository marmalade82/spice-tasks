import React from "react";
import { Layout, Type, Class } from "src/Components/Styled/StyleSheets";

import { ColumnView, RowView, RowReverseView, HeaderText, BodyText } from "src/Components/Basic/Basic";
import { View, Text, StyleProp, ViewStyle, ScrollView, } from "react-native";
import { Icon as ElIcon } from "react-native-elements";
import { 
    LEFT_SECOND_MARGIN, ICON_CONTAINER_WIDTH, PRIMARY_COLOR, 
    RIGHT_SECOND_MARGIN, TEXT_HORIZONTAL_MARGIN, SECONDARY_COLOR, 
    PRIMARY_COLOR_LIGHT, CONTAINER_VERTICAL_MARGIN, CONTAINER_ELEVATION, LEFT_FIRST_MARGIN, TEXT_VERTICAL_MARGIN, ROW_HEIGHT, RIGHT_FIRST_MARGIN
} from "src/Components/Styled/Styles";
import { Icon } from "./Icon";

interface Props {
    headerText: string;
    bodyText: () => JSX.Element;
    style: StyleProp<ViewStyle>
    footerElements: (() => JSX.Element)[]
    iconType?: "goal" | "task" | "reward" | "penalty" | "earned_reward" | "earned_penalty";
}

interface State {

}

export default class Summary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
                <ColumnView style={[{
                    backgroundColor: "white",
                    justifyContent: "flex-start",
                    paddingBottom: 30,
                    marginBottom: CONTAINER_VERTICAL_MARGIN,
                    flex: 0,
                    overflow: "hidden",
                    elevation: CONTAINER_ELEVATION,
                }, this.props.style]}>
                    <ScrollView style={{
                    }}>
                        <RowView style={[{
                            flex: 0,
                            paddingLeft: LEFT_SECOND_MARGIN,
                            paddingRight: RIGHT_FIRST_MARGIN,
                        }, Layout.CENTERED_SECONDARY]}>
                            <RowView style={[{
                                flex: 1,
                            }, Layout.CENTERED_SECONDARY]}>
                                <Text style={{
                                        marginTop: TEXT_VERTICAL_MARGIN,
                                        marginBottom: TEXT_VERTICAL_MARGIN,
                                    }}
                                >
                                    <HeaderText 
                                        level={3} 
                                        style={{
                                            
                                        }}
                                    >
                                        {this.props.headerText}
                                    </HeaderText>
                                </Text>
                            </RowView>
                            <RowView style={[{
                                flex: 0,
                                justifyContent: "flex-end",
                                alignItems: "center",
                                height: ROW_HEIGHT,
                                marginTop: 5,
                                backgroundColor: "white",
                            }]}>
                                {this.props.footerElements.map((render) => {
                                    return (
                                        <View
                                            style={{
                                                flex: 0,
                                                marginLeft: RIGHT_SECOND_MARGIN / 2,
                                            }}
                                        >
                                            {render()}
                                        </View>
                                    );
                                })}
                            </RowView>
                        </RowView>
                        <RowView style={{
                            flex: 0,
                            justifyContent: "flex-start",
                            paddingLeft: LEFT_SECOND_MARGIN,
                            paddingRight: RIGHT_SECOND_MARGIN,
                            alignItems: "stretch",
                        }}>
                            {this.props.bodyText()}
                        </RowView>
                    </ScrollView>
                    
                </ColumnView>
        )
    }
}