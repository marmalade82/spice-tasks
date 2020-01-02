
import React from "react";
import { Controller, Subscriber } from "./Controller";
import { BasicController, State} from "./BasicController";
import { View, TextInput } from "react-native";

interface Props {}


export default class Test extends React.Component<Props, State> {
    controller: Controller<State>;

    constructor(props: Props) {
        super(props);
    }

    onChangeName = (name: string) => {
        this.controller.commit({
            name: name
        });
    }

    onChangeDrink = (drink: string) => {
        this.controller.commit({
            favorite_drink: drink
        });
    }

    render = () => {
        return ( 
            <View style={{flex: 1}}>
                <TextInput
                    onChangeText={this.onChangeName}
                />

                <TextInput
                    onChangeText={this.onChangeDrink}
                />
            </View>
        );
    }
}