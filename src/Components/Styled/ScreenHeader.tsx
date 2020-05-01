import React from "react";
import { Layout, Type, Class } from "src/Components/Styled/StyleSheets";
import { ColumnView, RowView, BodyText, HeaderText, RowReverseView, TouchableView } from "src/Components/Basic/Basic";
import { Icon } from "src/Components/Styled/Styled";
import { View, StyleProp, ViewStyle } from "react-native";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props {
    style?: StyleProp<ViewStyle>;
    navigation: Navigation<ScreenParams>;
    showBack: boolean;
    right?: (() => JSX.Element)[]
}

export default class ScreenHeader extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <RowView style={[Class.ScreenHeader_Container, Layout.CENTERED_SECONDARY, this.props.style]}>
                {this.renderBack()}
                <HeaderText level={1} style={Class.ScreenHeader_Header}
                    numberOfLines={1}
                    ellipsizeMode={"middle"}
                >
                    { this.props.children }
                </HeaderText>
                <RowReverseView style={Class.ScreenHeader_RightContainer}>
                    {this.renderRight()}
                </RowReverseView>
            </RowView>
        )
    }

    renderBack = () => {
        if(this.props.showBack) {
            return (
                <TouchableView style={{}}
                    onPress={() => {
                        this.props.navigation.goBack(null);
                    }}
                >
                    <Icon type= {"arrow-left"}
                        color={"white"}
                        backgroundColor={"transparent"}
                        size={23}
                    ></Icon>
                </TouchableView>
            )
        } else {
            return (
                    <Icon type={"none"}
                        color={"white"}
                        backgroundColor={"transparent"}
                    ></Icon>
            );
        }
    }

    renderRight = () => {
        if(this.props.right) {
            return this.props.right.map((render) => render())
        }

        return null;
    }
}