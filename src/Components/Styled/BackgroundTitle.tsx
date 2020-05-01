import React from "react";
import { NavigationRow, ScreenHeader, DocumentView, NavigationGroup } from "src/Components/Styled/Styled";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView } from "src/Components/Basic/Basic";
import { Layout, Type, Class } from "src/Components/Styled/StyleSheets";
import { StyleProp, ViewStyle } from "react-native";

interface Props {
    title: string,
    style?: StyleProp<ViewStyle>
}

export default class BackgroundTitle extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <RowView style={[Class.BackgroundTitle_Container, Layout.CENTERED_SECONDARY, this.props.style]}>
                <HeaderText level={2} style={Class.BackgroundTitle_Text}>
                    {this.props.title}
                </HeaderText>
            </RowView>
        );
    }
}