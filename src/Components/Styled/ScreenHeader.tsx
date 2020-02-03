import React from "react";
import { ColumnView, RowView, BodyText, HeaderText } from "src/Components/Basic/Basic";
import { PRIMARY_COLOR, ROW_CONTAINER_HEIGHT, CONTAINER_ELEVATION, Styles, TEXT_VERTICAL_MARGIN, LEFT_FIRST_MARGIN, RIGHT_FIRST_MARGIN, LEFT_SECOND_MARGIN, RIGHT_SECOND_MARGIN } from "./Styles";

export default class ScreenHeader extends React.Component {


    render = () => {
        return (
            <RowView style={[{
                flex: 0,
                height: ROW_CONTAINER_HEIGHT,
                backgroundColor: PRIMARY_COLOR,
                elevation: CONTAINER_ELEVATION,
            }, Styles.CENTERED_SECONDARY]}>
                <HeaderText level={1} style={{
                        marginTop: TEXT_VERTICAL_MARGIN,
                        marginLeft: LEFT_SECOND_MARGIN,
                        marginRight: RIGHT_SECOND_MARGIN,
                        marginBottom: TEXT_VERTICAL_MARGIN,
                        color: "white",
                    }}
                    numberOfLines={1}
                    ellipsizeMode={"middle"}
                >
                    { this.props.children }
                </HeaderText>
            </RowView>
        )
    }
}