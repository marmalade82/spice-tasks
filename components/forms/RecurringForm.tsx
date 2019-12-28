import React from "react";
import { Text, View, Button, } from "react-native";
import Style from "../../styles/Style";
import { ChoiceInput, DateTimeInput } from "../inputs/Inputs";

interface Props {
    onDataChange?: (data: Data) => void;
    data?: Data
    onSave: (data: Data) => void;
}

interface State {
    recurs: string;
    date: Date;
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

interface Data {
    recurs: string;
    date: Date;
}

export default class RecurringForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            recurs: this.props.data.recurs ? this.props.data.recurs : "never",
            date: this.props.data.date ? this.props.data.date : new Date(),
        }
    }

    data: () => Data = () => {
        return {
            recurs: this.state.recurs,
            date: this.state.date,
        }
    }

    onRepeatChange = (value: string) => {
        this.setState({
            recurs: value
        });

        this.dataChanged();
    }

    onDateChange = (date: Date) => {
        this.setState({
            date: date
        });

        this.dataChanged();
    }

    dataChanged = () => {
        if(this.props.onDataChange) {
            this.props.onDataChange(this.data());
        }
    }

    render = () => {
        return (
            <View style={[Style.container, {justifyContent: "flex-start"}]}>
                <ChoiceInput
                    title={"Repeats"}
                    choices={recur_types}
                    selectedValue={this.state.recurs}
                    onValueChange={ this.onRepeatChange }
                >

                </ChoiceInput>
                <DateTimeInput
                    title={"When?"}
                    type={"date"}
                    onValueChange={this.onDateChange}
                    value={this.state.date}
                >
                </DateTimeInput>
                <Button title="Save"
                    onPress={() => {this.props.onSave(this.data())}}
                >
                </Button>
            </View>
        )
    }
}