import React from "react";

import { View, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText } from "src/Components/Basic/Basic";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";
import { ROW_CONTAINER_HEIGHT, ROW_HEIGHT, PRIMARY_COLOR, ICON_CONTAINER_WIDTH, Styles, TEXT_VERTICAL_MARGIN, TEXT_HORIZONTAL_MARGIN, LEFT_FIRST_MARGIN, CONTAINER_VERTICAL_MARGIN, CONTAINER_ELEVATION, SECONDARY_COLOR } from "./Styles";
import StyledIcon from "./Icon";

interface Props {
    number?: number;
    icon?: "goal" | "task" | "reward" | "penalty" | "recur" | "earned_reward" | "earned_penalty";
    text: string;
    navOptions?: navOptions
    style?: StyleProp<ViewStyle>
}

interface navOptions {
    navigation: any
    destination: string,
    parameters: object,
    type: "push" | "navigate",
}


export default class NavigationRow extends React.Component<Props> {

    constructor(props: Props ) {
        super(props);
    }

    render = () => {
            return (
                <View
                    style={[{
                        flex: 0,
                        justifyContent: "space-evenly",
                        width: "100%",
                        height: ROW_CONTAINER_HEIGHT,
                        marginBottom: CONTAINER_VERTICAL_MARGIN,
                        backgroundColor: "white",
                        elevation: CONTAINER_ELEVATION,
                    }, this.props.style]}
                >
                    {this.renderContent()}
                </View>
            );
    }

    renderContent = () => {
        if(this.props.navOptions) {
            const { navigation, destination, parameters, type} = this.props.navOptions
            return (
                    <ClickNavigation
                        style={{
                            flex: 0,
                            backgroundColor: "transparent",
                        }}
                        navigation={navigation}
                        destination={destination}
                        parameters={parameters}
                        navType={type}
                    >
                        {this.renderRow()}
                    </ClickNavigation>
            );
        } else {
            return this.renderRow();
        }

    }
    
    renderRow = () => {
        return (
                <RowView style={[{
                    flex: 0,
                    height: ROW_HEIGHT,
                    paddingLeft: LEFT_FIRST_MARGIN,
                }, Styles.CENTERED_SECONDARY]}>
                    { this.renderThumbnail() }
                    <HeaderText level={3} style={{
                        margin: TEXT_VERTICAL_MARGIN,
                        marginLeft: TEXT_HORIZONTAL_MARGIN,
                        marginRight: TEXT_HORIZONTAL_MARGIN,
                    }}>
                        {this.props.text}
                    </HeaderText>
                </RowView>
        )
    }

    renderThumbnail = () => {
        if(this.props.number !== undefined) {
            return (
                <View style={[{
                    height: ICON_CONTAINER_WIDTH,
                    width: ICON_CONTAINER_WIDTH,
                    borderRadius: ICON_CONTAINER_WIDTH/2,
                    backgroundColor: PRIMARY_COLOR,
                }, Styles.CENTERED]}>
                    <HeaderText level={3} style={{
                        color: "white",
                    }}>
                        { this.props.number }
                    </HeaderText>
                </View>
            )
        } else if(this.props.icon) {
            return (
                <StyledIcon
                    type={this.props.icon}
                    backgroundColor={"white"}
                    color={SECONDARY_COLOR}
                ></StyledIcon>
            );
        }
    }
}