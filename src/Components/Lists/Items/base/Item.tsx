import React from "react"

interface ItemProps<Item> {
    item: Item
    accessibilityLabel: string;
}

interface State {

}

export default class Item<Props, State, Item> extends React.Component<Props & ItemProps<Item>, State> {

}

export {
    Item,
    ItemProps,
}