
import React from "react";
import { RowView, ColumnView, HeaderText } from "src/Components/Basic/Basic";
import { 
    LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN, Styles, 
    TEXT_VERTICAL_MARGIN, RIGHT_SECOND_MARGIN, TEXT_GREY,
    PLACEHOLDER_GREY,
    CONTAINER_VERTICAL_MARGIN,
} from "src/Components/Styled/Styles";
import { StyleProp, ViewStyle, TextInput as Input, Picker } from "react-native";


interface Props {
    style?: StyleProp<ViewStyle>
    underlineColor?: string;
    value: string;
    choices: LabelValue[]
    accessibilityLabel?: string;
    onValueChange: (itemValue: string, itemPosition: number) => void
}

interface LabelValue {
    label: string,
    value: string,
    key: string,
}


export default class ChoiceInput extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <RowView style={[{
                flex: 0,
                backgroundColor: "transparent",
                paddingLeft: LEFT_SECOND_MARGIN,
                paddingRight: RIGHT_SECOND_MARGIN,
                justifyContent: "flex-start",
                alignItems: "flex-end",
                marginTop: 0,
                }, this.props.style]}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                <ColumnView style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    borderColor: this.props.underlineColor ? this.props.underlineColor : TEXT_GREY,
                    borderBottomWidth: 1,
                }}>

                    <Picker
                        selectedValue={this.props.value}
                        onValueChange={this.props.onValueChange}
                        accessibilityLabel={this.props.accessibilityLabel ? "input-" + this.props.accessibilityLabel : undefined}
                        style={[{
                            padding: 0,
                        }]}
                        itemStyle={[Styles.HEADER_3, {
                            padding: 0,
                        }]}
                    >
                        {this.renderChoices(this.props.choices)}
                    </Picker>

                </ColumnView>


            </RowView>
        );
    }

    renderChoices = (choices: LabelValue[]) => {
        return choices.map((choice: LabelValue) => {
            return (
                <Picker.Item label={choice.label} value={choice.value} key={choice.key}/>
            );
        })
    }

}