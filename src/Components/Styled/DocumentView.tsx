import React from "react";
import { ColumnView } from "src/Components/Basic/Basic";
import { PRIMARY_COLOR_LIGHT } from "./Styles";

export default class DocumentView extends React.Component {


    render = () => {
        return (
            <ColumnView style={{
                justifyContent: "flex-start",
                backgroundColor: PRIMARY_COLOR_LIGHT,
            }}>
                {this.props.children}
            </ColumnView>
        )
    }
}