import React from "react";
import { ColumnView } from "src/Components/Basic/Basic";
import { Class } from "./StyleSheets";

interface Props {
    accessibilityLabel: string;
}

export default class DocumentView extends React.Component<Props> {


    render = () => {
        return (
            <ColumnView style={Class.DocumentView_Container}
                accessibilityLabel={this.props.accessibilityLabel + "-screen"}
            >
                {this.props.children}
            </ColumnView>
        )
    }
}