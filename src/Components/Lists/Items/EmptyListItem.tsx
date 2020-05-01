
import { Layout, Type, Class } from "src/Components/Styled/StyleSheets";
import React from "react";
import { ColumnView } from "src/Components/Basic/Basic";

interface Props {

}

interface State {

}


export default class EmptyListItem extends React.Component<Props, State>  {
    constructor(props: Props) {
        super(props);
    }
    
    render = () => {
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