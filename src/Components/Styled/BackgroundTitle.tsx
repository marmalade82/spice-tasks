import React from "react";
import { NavigationRow, ScreenHeader, DocumentView, NavigationGroup } from "src/Components/Styled/Styled";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView } from "src/Components/Basic/Basic";
import { 
    CONTAINER_VERTICAL_MARGIN, ROW_CONTAINER_HEIGHT, 
    LEFT_SECOND_MARGIN, PRIMARY_COLOR_LIGHT, LEFT_FIRST_MARGIN, ICON_CONTAINER_WIDTH, TEXT_GREY
} from "src/Components/Styled/Styles";
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
            <RowView style={[{
                flex: 0,
                height: 50,
                backgroundColor: PRIMARY_COLOR_LIGHT,
                paddingLeft: LEFT_SECOND_MARGIN, //LEFT_FIRST_MARGIN + (ICON_CONTAINER_WIDTH / 2),
                marginTop: CONTAINER_VERTICAL_MARGIN,
            }, Layout.CENTERED_SECONDARY, this.props.style]}>
                <HeaderText level={2} style={{
                    color: TEXT_GREY,
                }}>
                    {this.props.title}
                </HeaderText>
            </RowView>
        );
    }
}