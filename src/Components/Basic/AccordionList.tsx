import React from "react";
import { FlatList, StyleProp, Text, ViewStyle, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { ColumnView, RowView, } from "src/Components/Basic/Basic";
import DataComponent from "src/Components/base/DataComponent";

interface ListProps<Item> {
    items: (Item & Identifiable)[]  //List of properties that go into an item
    renderItem: (item: Item & Identifiable) => JSX.Element
}

interface Identifiable {
    id: string;
}

interface Props {
    data: State | false,
    onDataChange: (d: State) => void,
    accessibilityLabel: string;
    renderHeader: () => JSX.Element;
    headerStyle: StyleProp<ViewStyle>;
    bodyStyle: StyleProp<ViewStyle>;
}

interface State extends Data {
    opacity: Animated.Value;
}

interface Data {
    expanded: boolean
}
const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "lightblue",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "95%",
    },
    row: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "pink",
        justifyContent: "center",
        alignItems: "stretch",
    },
});

function Default(): Data {
    return {
        expanded: true,
    }
}

export default class AccordionList<Item> extends DataComponent<Props & ListProps<Item>, State, Data> {
    constructor(props: Props & ListProps<Item>) {
        super(props);

        this.state = {
            opacity: new Animated.Value(1),
            ...Default()
        }
    }

    doCollapse = () => {
        this.setData({
            expanded: false
        })
        this.setState({
            opacity: new Animated.Value(0)
        })
    }

    doExpand = () => {
        this.setData({
            expanded: true
        })
    }

    render = () => {
        return (
            <ColumnView 
                style={[{
                    justifyContent: "flex-start"
                }]}
                accessibilityLabel={"accordion-" + this.props.accessibilityLabel} 
            >
                <RowView style={this.props.headerStyle}>
                    {this.renderClickableHeader()}
                </RowView>
                {this.renderBody()}
            </ColumnView>
        )
    }

    renderClickableHeader = () => {
        return (
            <TouchableOpacity style={[localStyle.row]} onPress={() => {
                if(this.data().expanded) {
                    this.doCollapse()
                } else {
                    this.doExpand()
                }
            }}>
                {this.props.renderHeader()}
            </TouchableOpacity>
        )

    }

    renderBody = () => {
        if(this.data().expanded) {
            return (
                <ColumnView style={[this.props.bodyStyle]}>
                    {this.renderItems()}
                </ColumnView>
            )
        }     
    }

    renderItems = () => {
        return this.props.items.map((item: Item & Identifiable) => {
            return (
                <ColumnView style={{}} key={item.id}>
                    {this.props.renderItem(item)}
                </ColumnView>
            );
        });
    }
}