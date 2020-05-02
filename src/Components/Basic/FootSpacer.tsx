
import React from "react";
import { View } from "react-native";
import { Class } from "../Styled/StyleSheets";

interface Props {
}

export default class FootSpacer extends React.Component<Props> {

    render = () => {
        return (
            <View style={Class.FootSpacer_Container}></View>
        );
    }
}