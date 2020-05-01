
import React from "react";

import { View, StyleProp, ViewStyle } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, RowReverseView } from "src/Components/Basic/Basic";
import { TouchableOpacity } from "react-native";
import { 
    ROW_HEIGHT, 
    ROW_CONTAINER_HEIGHT, 
    LEFT_FIRST_MARGIN,
    RIGHT_FIRST_MARGIN,
    ICON_CONTAINER_WIDTH,
    PRIMARY_COLOR,
    TEXT_VERTICAL_MARGIN,
    TEXT_HORIZONTAL_MARGIN,
} from "src/Components/Styled/Styles";
import { Layout, Type, Class } from "src/Components/Styled/StyleSheets";

interface Props {
    number: number;
    text: string;
    onPress?: () => void;
    key?: any;
    rightElements: (() => JSX.Element)[]
    style?: StyleProp<ViewStyle>
    accessibilityLabel?: string;
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
                        height: ROW_CONTAINER_HEIGHT,
                        width: "100%",
                        backgroundColor: "white",
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
                        style={[{
                            flex: 0,
                            height: ROW_HEIGHT,
                            width: "100%",
                            backgroundColor: "white",
                            flexDirection: "row",
                        }, Layout.CENTERED_PRIMARY]}
                        onPress={this.props.onPress}
                        accessibilityLabel={this.props.accessibilityLabel ? "input-" + this.props.accessibilityLabel : undefined }
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
                <RowView style={[{
                    flex: 1,
                    height: ROW_HEIGHT,
                    width: "100%",
                    paddingLeft: LEFT_FIRST_MARGIN,
                    paddingRight: RIGHT_FIRST_MARGIN,
                }, Layout.CENTERED_PRIMARY]}>
                    <RowView style={[{
                        backgroundColor: "white",
                    }, Layout.CENTERED_SECONDARY]}>
                        <View style={[{
                            height: ICON_CONTAINER_WIDTH,
                            width: ICON_CONTAINER_WIDTH,
                            borderRadius: ICON_CONTAINER_WIDTH/2,
                            backgroundColor: PRIMARY_COLOR,
                        }, Layout.CENTERED]}>
                            <HeaderText level={3} style={{
                                color: "white",
                            }}>
                                { this.props.number }
                            </HeaderText>
                        </View>
                        <HeaderText level={3} style={{
                            marginTop: TEXT_VERTICAL_MARGIN,
                            marginBottom: TEXT_VERTICAL_MARGIN,
                            marginLeft: TEXT_HORIZONTAL_MARGIN,
                        }}>
                            {this.props.text}
                        </HeaderText>

                    </RowView>
                    <RowReverseView style={[{
                        flex: 0, // this takes up as much as space as what it contains.
                        backgroundColor: "white",
                    }, Layout.CENTERED_SECONDARY]}>
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