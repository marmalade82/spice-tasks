
import React from "react";
import { View } from "react-native";
import { StyleSheetContext } from "../Styled/StyleSheets";

interface Props {
}

export default class FootSpacer extends React.Component<Props> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <View style={Class.FootSpacer_Container}></View>
        );
    }
}
