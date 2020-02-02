import React from "react";

import {
    ItemProps
} from "src/Components/Lists/Items/base/Item";

import { 
    View, StyleSheet, TextInput, 
    FlatList, Text, TouchableOpacity, ListRenderItem,
} from "react-native";

interface ListProps<Item> {
    items: (Item & Identifiable)[]  //List of properties that go into an item
    renderItem: <P, S>(item: Item & Identifiable) => JSX.Element
}

interface Identifiable {
    id: string;
}

const localStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
    },
    list: {
        flex: 1,
        backgroundColor: "transparent",
    },
});



export default class List<Props, State, Item> extends React.Component<Props & ListProps<Item>, State> {
    constructor(props: Props & ListProps<Item>) {
        super(props);
    }

    renderItem = (i: {item: any}) => {
        const item = i.item;
        return this.props.renderItem(item);

    };

    render = () => {
        return (
            <View style={[localStyle.container]}>
                <FlatList
                    data={ this.props.items }
                    renderItem={({item}) => {
                        return this.props.renderItem(item);
                    }}
                    keyExtractor={(item) => { return item.id }}
                ></FlatList>
            </View>
        );
    }
}