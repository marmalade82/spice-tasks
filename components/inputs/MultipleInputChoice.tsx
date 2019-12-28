import React from "react";
import { View, Text, StyleSheet } from "react-native";



interface Props {
    title: string
    checked: boolean
    onCheck: (val: boolean) => void;
}

interface State {

}

const localStyle = StyleSheet.create({
    container: {

    },
    text: {

    },
})

export default class MultipleInputChoice extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }



    render = () => {
        return (
            <View>
                <Text>{this.props.title}</Text>
            </View>

        );
    }

}