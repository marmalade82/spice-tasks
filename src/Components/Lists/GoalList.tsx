

import React from "react";
import { View, TextInput } from "react-native";


interface Props {
}

interface State {
    title: string;
}

export default class GoalList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }


    render = () => {
        return (
            <View>
                <TextInput
                    value={this.state.title}    
                    onChangeText={(txt) => {
                        this.setState({
                            title: txt
                        })
                    }}
                >

                </TextInput>
            </View>
        );
    }
}