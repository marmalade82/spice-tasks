
import React from "react";
import { View } from "react-native";
import { ROW_CONTAINER_HEIGHT } from "../Styled/Styles";

interface Props {
}

export default class FootSpacer extends React.Component<Props> {

    render = () => {
        return (
            <View style={{flex: 0, marginBottom: ROW_CONTAINER_HEIGHT}}></View>
        );
    }
}