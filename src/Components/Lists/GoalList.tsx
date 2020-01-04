

import {
    ControlledComponent,
    ChildRegistrar,
} from "../../../components/ControlledComponent";
import {
    GoalListController,
    Data,
} from "../../../components/lists/GoalList/GoalListController";
import React from "react";
import { View, TextInput } from "react-native";


interface Props {
    registerChild: ChildRegistrar<Data>;
    initialData: Data;
}

interface State extends Data {

}

export default class GoalList extends ControlledComponent<State, Props, Data> {
    constructor(props: Props) {
        super(props, (d: Data) => { return new GoalListController(d)});
    }


    render = () => {
        return (
            <View>
                <TextInput
                    value={this.state.title}    
                    onChangeText={(txt) => {
                        this.controller.commit({
                            title: txt
                        });
                    }}
                >

                </TextInput>
            </View>
        );
    }
}