
import { Layout, Type, StyleSheetContext } from "src/Components/Styled/StyleSheets";
import React from "react";
import { ColumnView } from "src/Components/Basic/Basic";

interface Props {

}

interface State {

}


export default class EmptyListItem extends React.Component<Props, State>  {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: Props) {
        super(props);
    }
    
    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <ColumnView
                style={[Class.RowContainer]}
            ></ColumnView>
        );
    }
}

export {
    EmptyListItem,
}