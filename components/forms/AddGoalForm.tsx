import React from "react";

import { Text, TextInput, View, Picker } from "react-native";
import {
    ChoiceInput,
    StringInput,
    ModalInput,
} from "../inputs/Inputs";
import RecurringForm from "./RecurringForm";
import Style from "../../styles/Style";

interface Props {
    navigation: Navigator
}

interface State {
    title: string
    recurring: boolean
    due_date: Date
    reward: Reward
    penalty: Penalty
}

interface Navigator {
    navigate: (screen: string) => void
}

enum Reward {
    NONE = 1,
    DICE,
    ONE,
}

enum Penalty {
    NONE = 1,
    DICE,
    ONE,
}

interface LabelValue {
    label: string,
    value: string,
    key: string

}

const rewards: LabelValue[] = [
    { label: "none", value: Reward.NONE.toString(), key: Reward.NONE.toString() },
    { label: "dice", value: Reward.DICE.toString(), key: Reward.DICE.toString()},
    { label: "choose one...", value: Reward.ONE.toString(), key: Reward.ONE.toString() },
].sort((a, b) => {
    return parseInt(a.value) - parseInt(b.value)
});

const penalties: LabelValue[] = [
    { label: "none", value: Penalty.NONE.toString(), key: Penalty.NONE.toString() },
    { label: "dice", value: Penalty.DICE.toString(), key: Penalty.DICE.toString() },
    { label: "Choose one...", value: Penalty.ONE.toString(), key: Penalty.ONE.toString() },
].sort((a, b) => {
    return parseInt(a.value) - parseInt(b.value);
});


export default class AddGoalForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            title: "",
            recurring: false,
            due_date: new Date(),
            reward: Reward.DICE,
            penalty: Penalty.NONE,
        }
    }

    onChangeText = (text: string) => {
        this.setState({
            title: text
        });
    }

    renderChoices = (choices: LabelValue[]) => {
        return choices.map((choice: LabelValue) => {
            return (
                <Picker.Item label={choice.label} value={choice.value}/>
            );
        })
    }



    render = () => {
        return (
            <View style={[Style.container, Style.blueBg]}>
                <StringInput
                    title={"Summary"}
                    value={this.state.title}
                    placeholder={"What do you want to achieve?"}
                    onChangeText={this.onChangeText}
                >
                </StringInput>

                <ChoiceInput
                    title={"Reward"}
                    selectedValue={this.state.reward.toString()}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({reward: parseInt(itemValue)})  
                    }}
                    choices={rewards}
                >

                </ChoiceInput>

                <ChoiceInput
                    title={"Penalty"}
                    selectedValue={this.state.penalty.toString()}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({penalty: parseInt(itemValue)})  
                    }}
                    choices={penalties}
                >
                </ChoiceInput>

                <ModalInput
                    title={"Recurring?"} 
                    animationType={"fade"}
                    screenType={"grey"}
                >
                    <View style={[Style.modalContainer, {backgroundColor: "white"}]}>
                        <RecurringForm></RecurringForm>
                    </View>
                </ModalInput>
            </View>
        )
    }
}
                /*<Text>Add Goal!</Text>
                <DateTimePicker></DateTimePicker>*/