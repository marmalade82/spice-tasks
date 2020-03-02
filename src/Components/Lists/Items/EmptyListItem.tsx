
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Item from "src/Components/Lists/Items/base/Item";
import { ListItem } from "src/Components/Styled/Styled";
import MyDate from "src/common/Date";
import { tsPropertySignature } from "@babel/types";
import { ColumnView } from "src/Components/Basic/Basic";
import { ROW_CONTAINER_HEIGHT } from "src/Components/Styled/Styles";


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
                style={{
                    flex: 0,
                    height: ROW_CONTAINER_HEIGHT,
                    width: "100%",
                }}
            ></ColumnView>
        );
    }
}

export {
    EmptyListItem,
}