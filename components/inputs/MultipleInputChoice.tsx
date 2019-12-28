import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Style from "../../styles/Style";



interface Props {
    title: string
    checked: boolean
    onCheck: (val: boolean) => void;
    style: any;
    key: string;
}

interface State {

}

export default class MultipleInputChoice extends React.Component<Props, State> {
    localStyle: any
    constructor(props: Props) {
        super(props);

        this.localStyle = {
            container: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderColor: "grey",
                borderWidth: 1,
                aspectRatio: 1,
                borderRadius: 50,
            },
            text: {

            },
        }
    }



    render = () => {
        return (
            <View 
                style={[this.localStyle.container, Style.greenBg, this.props.style]}
            >
                <Text>{this.props.title}</Text>
            </View>

        );
    }

}