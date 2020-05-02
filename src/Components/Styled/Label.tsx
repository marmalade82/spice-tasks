import React from "react";
import { RowView, ColumnView, HeaderText } from "src/Components/Basic/Basic";
import { StyleProp, ViewStyle } from "react-native";
import { Layout, Type, Class } from "src/Components/Styled/StyleSheets";

interface Props {
    text: string;
    textColor?: string;
    style?: StyleProp<ViewStyle>;
}

export default class Label extends React.Component<Props> {

    render = () => {
        return (
            <RowView style={[Class.Label_Container, Layout.CENTERED_SECONDARY, this.props.style]}
            >
                <HeaderText level={3} style={[Class.TextInputType, {
                    ...(this.props.textColor && {color: this.props.textColor})
                }]}>
                    {this.props.text}
                </HeaderText>
            </RowView>
        );
    }

}
