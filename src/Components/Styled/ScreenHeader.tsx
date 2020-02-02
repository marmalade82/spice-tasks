import React from "react";
import { ColumnView, RowView, BodyText, HeaderText } from "src/Components/Basic/Basic";

export default class ScreenHeader extends React.Component {


    render = () => {
        return (
            <RowView style={{
                flex: 0,
                height: 60,
                backgroundColor: "rgb(191,38,0)",
                justifyContent: "flex-start",
                elevation: 10,
                alignItems: "center",
            }}>
                <HeaderText level={1} style={{
                    marginTop: 15,
                    marginLeft: 15 + 37 + 9,
                    marginRight: 15,
                    marginBottom: 15,
                    color: "white",
                }}>
                    { this.props.children }
                </HeaderText>
            </RowView>
        )
    }
}