import React from "react";
import { ColumnView } from "src/Components/Basic/Basic";

export default class DocumentView extends React.Component {


    render = () => {
        return (
            <ColumnView style={{
                justifyContent: "flex-start",
                backgroundColor: "rgb(237,223,220)"
            }}>
                {this.props.children}
            </ColumnView>
        )
    }
}