import React from "react";
import { 
    View, StyleSheet, KeyboardAvoidingView, StyleProp, ViewStyle
} from "react-native";
import { 
    NumberInput, ChoiceInput, DateTimeInput,
    MultipleInput
} from "src/Components/Inputs";
import DataComponent from "src/Components/base/DataComponent";
import Style from "src/Style/Style";
import { DayOfWeek } from "lib/recurrence";
import { ColumnView } from "src/Components/Basic/Basic";

interface Props {
    data: State | false
    onDataChange: (d: State) => void;
    containerStyle?: StyleProp<ViewStyle>;
}

interface State {
    minimum: number,
    type: "daily" | "weekly" | "monthly"
}

function Default(): State {
    return {
        minimum: 0,
        type: "daily",
    }
}

export default class StreakForm extends DataComponent<Props, State, State> {
    constructor(props: Props) {
        super(props);

        this.state = Default();
    }

    private onChangeType = (val: string) => {
        if(val === "daily" || val === "weekly" || val === "monthly") {
            this.setData({
                type: val
            });
        } else {
            this.setData({
                type: "daily"
            })
        }
    }

    render = () => {
        return (
            <ColumnView
                style={[{
                    flex: 0,
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                    backgroundColor: "transparent",
                }, this.props.containerStyle]}
            >
                <ChoiceInput
                    title={"Habit Type"}
                    data={this.data().type} 
                    choices={streak_choices}
                    onDataChange={this.onChangeType}
                    accessibilityLabel={"streak-type"}
                />
            </ColumnView>

        );
    }
}

export const streak_choices = [
    {   label: "Daily",
        value: "daily",
        key: "0"
    }, 
    { label: "Weekly"
    , value: "weekly"
    , key: "1"
    },
    { label: "Monthly"
    , value: "monthly"
    , key: "2"
    }
];


export {
    StreakForm,
    State as StreakData,
    Default as StreakDefault,
}