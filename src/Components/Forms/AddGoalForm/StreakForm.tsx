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

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
    }
})

function Default(): State {
    return {
        minimum: 2,
        type: "daily",
    }
}

export default class StreakForm extends DataComponent<Props, State, State> {
    constructor(props: Props) {
        super(props);

        this.state = Default();
    }


    onChangeMinimum = (val: number) => {
        this.setData({
            minimum: val
        });
    }

    onChangeType = (val: string) => {
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
                <NumberInput
                    title={"Minimum"}
                    value={this.data().minimum}
                    type={"integer"}
                    minimum={2}
                    precision={0}
                    onValueChange={this.onChangeMinimum}
                    accessibilityLabel={"streak-minimum"}
                />
                <ChoiceInput
                    title={"Streak Type"}
                    selectedValue={this.data().type} 
                    choices={streak_choices}
                    onValueChange={this.onChangeType}
                    accessibilityLabel={"streak-type"}
                />
            </ColumnView>

        );
    }
}

const streak_choices = [
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

const week_start_choices = [
    { label: "Su"
    , value: "sunday"
    , key: "0"
    },
    { label: "Mo"
    , value: "monday"
    , key: "1"
    },
    { label: "Tu"
    , value: "tuesday"
    , key: "2"
    },
    { label: "We"
    , value: "wednesday"
    , key: "3"
    },
    { label: "Th"
    , value: "thursday"
    , key: "4"
    },
    { label: "Fr"
    , value: "friday"
    , key: "5"
    },
    { label: "Sa"
    , value: "saturday"
    , key: "6"
    },
];

export {
    StreakForm,
    State as StreakData,
    Default as StreakDefault,
}