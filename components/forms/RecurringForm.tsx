import React from "react";
import { Text, View } from "react-native";
import Style from "../../styles/Style";
import { ChoiceInput, DateTimeInput } from "../inputs/Inputs";

interface Props {

}

interface State {
    recurs: string
}

const recur_types = [
    { label: "Never"
    , value: "never"
    , key: "0"
    }, 
    { label: "Once"
    , value: "once"
    , key: "1"
    },
    { label: "Daily"
    , value: "daily"
    , key: "2"
    },
    { label: "Weekly"
    , value: "weekly"
    , key: "3"
    },
    { label: "Monthly"
    , value: "monthly"
    , key: "4"
    }

];

export default class RecurringForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            recurs: "never"
        }
    }

    render = () => {
        return (
            <View style={[Style.container, {justifyContent: "flex-start"}]}>
                <ChoiceInput
                    title={"Repeats"}
                    choices={recur_types}
                    selectedValue={this.state.recurs}
                    onValueChange={(value) => {this.setState({ recurs: value })}}
                >

                </ChoiceInput>
                <DateTimeInput
                    title={"When?"}
                >
                </DateTimeInput>
            </View>
        )
    }
}