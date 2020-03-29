import React from "react";
import { FlatList, View } from "react-native";
import { TAB_GREY, PLACEHOLDER_GREY, BACKGROUND_GREY, BORDER_GREY, LEFT_FIRST_MARGIN } from "./Styles";
import { BodyText, TouchableView } from "../Basic/Basic";
import { Icon } from "./Icon";
import { ModalIconButton } from "./Styled";


export interface LabelValue<Choices> {
    label: string;
    value: Choices;
    key: string;
}

interface Props<Choices> {
    choices: LabelValue<Choices>[]
    onPick: (choice: Choices) => void;
    current: Choices
}

interface State {
    showSorting: boolean;
}

const marginHorizontal = 13;
const spacer = 10;

export class SidescrollPicker<Choices> extends React.Component<Props<Choices>, State> {
    constructor(props: Props<Choices>) {
        super(props);
        this.state = {
            showSorting: false
        }
    }



    render = () => {
        return (
            <View
                style={{
                    flex: 0,
                    flexDirection: "row",
                    paddingVertical: 10,
                    backgroundColor: "white",
                    elevation: 7,
                }}
            >
                <ModalIconButton
                    data={{
                        showModal: this.state.showSorting,
                    }}
                    onDataChange={({ showModal }) => {
                        this.setState({
                            showSorting: showModal,
                        })
                    }}
                    type={"add"}
                    backgroundColor={"white"}
                    color={TAB_GREY}
                >

                </ModalIconButton>
                <FlatList
                    horizontal={true}
                    data={this.props.choices}
                    renderItem={({item, index, separators}) => {
                        return this.renderLabel(item);
                    }}
                    style={{
                        flex: 0,
                    }}
                    showsHorizontalScrollIndicator={false}
                    ListHeaderComponent={
                        <View
                            style={{
                                flex: 0,
                                width: spacer + 3,
                            }}
                        ></View>
                    }
                ></FlatList>
            </View>
        )
    }

    private renderLabel = (item: LabelValue<Choices>) => {
        return (
            <TouchableView
                style={{
                    flex: 0,
                }}
                onPress={() => {
                    this.props.onPick(item.value);
                }}
            >
                <View
                    style={{
                        flex: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 7,
                        marginRight: spacer,
                        ...colorStyles(this.props.current, item.value),
                    }}
                >
                    <BodyText
                        style={{
                            marginHorizontal: marginHorizontal,
                            fontSize: 14,
                            ...textStyles(this.props.current, item.value),
                        }}
                    >
                        {item.label}
                    </BodyText> 
                </View>
            </TouchableView>
        )

        function colorStyles(current: Choices, actual: Choices) {
            if(current === actual) {
                return {
                    backgroundColor: TAB_GREY,
                    borderColor: TAB_GREY,
                    borderWidth: 1,
                    borderRadius: 20,
                } as const
            } else {
                return {
                    backgroundColor: BACKGROUND_GREY,
                    borderColor: BORDER_GREY,
                    borderWidth: 1,
                    borderRadius: 20,
                } as const;
            }

        }

        function textStyles(current: Choices, actual: Choices) {
            if(current === actual) {
                return {
                    color: "white",
                } as const;
            } else {
                return {
                    color: "black",
                } as const;
            }
        }
    }

}


export default SidescrollPicker;