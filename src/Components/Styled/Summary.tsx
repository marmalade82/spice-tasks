import React from "react";

import { ColumnView, RowView, RowReverseView, HeaderText, BodyText } from "src/Components/Basic/Basic";
import { View, Text, StyleProp, ViewStyle, ScrollView, } from "react-native";
import { Icon } from "react-native-elements";
import { 
    LEFT_SECOND_MARGIN, ICON_CONTAINER_WIDTH, PRIMARY_COLOR, 
    RIGHT_SECOND_MARGIN, TEXT_HORIZONTAL_MARGIN, SECONDARY_COLOR, PRIMARY_COLOR_LIGHT, CONTAINER_VERTICAL_MARGIN, CONTAINER_ELEVATION, LEFT_FIRST_MARGIN, Styles, TEXT_VERTICAL_MARGIN, ROW_HEIGHT
} from "src/Components/Styled/Styles";

interface Props {
    headerText: string;
    bodyText: () => JSX.Element;
    style: StyleProp<ViewStyle>
    footerElements: (() => JSX.Element)[]
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
                    marginBottom: CONTAINER_VERTICAL_MARGIN,
                    flex: 0,
                    maxHeight: "66%",
                    overflow: "hidden",
                    elevation: CONTAINER_ELEVATION,
                }, this.props.style]}>
                    <ScrollView style={{
                    }}>
                        <RowView style={[{
                            flex: 0,
                            paddingLeft: LEFT_FIRST_MARGIN,
                            paddingRight: RIGHT_SECOND_MARGIN,
                        }, Styles.CENTERED_SECONDARY]}>
                            <RowView style={[{
                                flex: 1,
                            }, Styles.CENTERED_SECONDARY]}>
                                <View style={[{
                                    marginTop: TEXT_VERTICAL_MARGIN,
                                    height: ICON_CONTAINER_WIDTH,
                                    width: ICON_CONTAINER_WIDTH,
                                    borderRadius: ICON_CONTAINER_WIDTH/2,
                                    backgroundColor: "white",
                                }, Styles.CENTERED_SECONDARY]}>
                                    <Icon
                                        name='sc-telegram'
                                        type='evilicon'
                                        color={SECONDARY_COLOR}
                                    ></Icon>
                                </View>
                                <Text style={{
                                        margin: TEXT_VERTICAL_MARGIN,
                                        marginLeft: TEXT_HORIZONTAL_MARGIN,
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
                    <RowView style={[{
                        flex: 0,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        height: ROW_HEIGHT,
                        paddingLeft: LEFT_SECOND_MARGIN,
                        paddingRight: RIGHT_SECOND_MARGIN,
                        marginTop: 5,
                        backgroundColor: "white",
                    }]}>
                        {this.props.footerElements.map((render) => {
                            return render();
                        })}
                    </RowView>
                    
                </ColumnView>
        )
    }
}