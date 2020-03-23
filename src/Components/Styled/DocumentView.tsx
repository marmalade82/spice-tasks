import React from "react";
import { ColumnView } from "src/Components/Basic/Basic";
import { PRIMARY_COLOR_LIGHT } from "./Styles";

interface Props {
    accessibilityLabel: string;
}

export default class DocumentView extends React.Component<Props> {


    render = () => {
        return (
            <ColumnView style={{
                    justifyContent: "flex-start",
                    backgroundColor: PRIMARY_COLOR_LIGHT,
                }}
                accessibilityLabel={this.props.accessibilityLabel + "-screen"}
            >
                {this.props.children}
            </ColumnView>
        )
    }
}