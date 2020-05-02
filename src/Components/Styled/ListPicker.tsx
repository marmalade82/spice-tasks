import React from "react";
import DataComponent from "src/Components/base/DataComponent";
import { ColumnView, RowView, RowReverseView, ColumnReverseView } from "src/Components/Basic/Basic";
import { ClickRow } from "./Styled";
import { Icon } from "react-native-elements";
import { View, StyleProp, ViewStyle } from "react-native";
import { Class } from "./StyleSheets";

interface Props {
    lists: List[]
    data: Data | false
    onDataChange: (d: Data) => void;
    layout: "top" | "bottom";
    style?: StyleProp<ViewStyle>;
}

interface List {
    selector: {
        number: number;
        text: string;
    };
    list: () => JSX.Element;
}

interface State extends Data {

}

interface Data {
    current: number;
}

function Default(): Data {
    return {
        current: 0
    };
}

export default class ListPicker extends DataComponent<Props, State, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            ...Default()
        };
    }

    render = () => {
        if(this.props.layout === "top") {
            return (
                <ColumnView style={[Class.ListPicker_Container, this.props.style]}
                >
                    <ColumnView style={Class.ListPicker_TopSelectors}>
                        { this.renderSelectors() }
                    </ColumnView>
                    <ColumnView style={Class.ListPicker_TopLists}>
                        { this.renderLists() }
                    </ColumnView>

                </ColumnView>
            );
        } else {
            return (
                <ColumnReverseView style={[Class.ListPicker_Container, this.props.style]}>
                    <ColumnView style={Class.ListPicker_BottomSelectors}>
                        { this.renderSelectors() }
                    </ColumnView>
                    <ColumnView style={Class.ListPicker_BottomLists}>
                        { this.renderLists() }
                    </ColumnView>

                </ColumnReverseView>

            )
        }
    }

    private renderSelectors = () => {
        return this.props.lists.map((list, index) => {
            const {number, text} = list.selector;
            return (
                <ClickRow
                    number={number}
                    text={text}
                    key={index}
                    rightElements={[
                        this.renderIcon(index)
                    ]}
                    onPress={() => {
                        this.setData({
                            current: index,
                        })
                    }}
                    style={{
                        borderTopWidth: index === 0 ? 1 : 0,
                        borderBottomWidth: index === this.props.lists.length - 1 ? 0 : 1,
                        ...Class.ListPicker_Selector
                    }}
                    accessibilityLabel={"view-" + (index + 1).toString() }
                >
                </ClickRow>
            )
        })
    }

    private renderIcon = (index: number) => {
        if(this.data().current === index) {
            return () => {
                ///Styles TODO : Fix this icon's styles?
                return (
                    <View style={Class.ListPicker_IconContainer}>
                        <Icon
                            name='check'
                            type='octicon'
                            color='green'
                            size={37}
                            key={index}
                            containerStyle={{
                                margin: 0,
                                padding: 0,
                                paddingRight: 0,
                                marginRight: 0,
                            }}
                            iconStyle={{
                                margin: 0,
                                marginRight: 0,
                                padding: 0,
                                paddingRight: 0,
                            }}
                        ></Icon>
                    </View>
                )
            }
        } else {
            return () => {
                return (<View></View>);
            }
        }
    }

    private renderLists = () => {
        const current = this.props.lists[this.data().current]
        if(current) {
            return current.list();
        }
    }
}

export {
    ListPicker,
    Data as ListPickerData,
    Default as ListPickerDefault,
}