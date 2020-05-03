import React from "react";
import { ColumnView } from "src/Components/Basic/Basic";
import { StyleSheetContext } from "./StyleSheets";

interface Props {
    accessibilityLabel: string;
}

export default class DocumentView extends React.Component<Props> {

    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>

    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <ColumnView style={Class.DocumentView_Container}
                accessibilityLabel={this.props.accessibilityLabel + "-screen"}
            >
                {this.props.children}
            </ColumnView>
        )
    }
}