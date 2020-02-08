import React from "react";
import { RowView, ColumnView, HeaderText } from "src/Components/Basic/Basic";
import { 
    LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, Styles, 
    TEXT_VERTICAL_MARGIN, RIGHT_SECOND_MARGIN, TEXT_GREY,
    PLACEHOLDER_GREY,
} from "src/Components/Styled/Styles";
import { StyleProp, ViewStyle } from "react-native";

interface Props {
    text: string;
    textColor?: string;
    style?: StyleProp<ViewStyle>;
}

export default class Label extends React.Component<Props> {

    render = () => {
        return (
            <RowView style={[{
                    flex: 0,
                    paddingLeft: LEFT_SECOND_MARGIN,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    backgroundColor: "transparent",
                    height: 30,
                }, Styles.CENTERED_SECONDARY, this.props.style]}
            >
                <HeaderText level={3} style={{
                    color: this.props.textColor ? this.props.textColor : TEXT_GREY,
                }}>
                    {this.props.text}
                </HeaderText>
            </RowView>
        );
    }

}
