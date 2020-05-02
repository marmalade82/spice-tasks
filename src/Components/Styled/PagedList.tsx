import React from "react";
import { ColumnView, RowView, TouchableView, BodyText, HeaderText } from "src/Components/Basic/Basic";
import { Button, StyleProp, ViewStyle } from "react-native";
import { Navigation, ScreenParams } from "src/common/Navigator";
import { Class, Layout } from "./StyleSheets";


export interface Props<Item, Screen extends keyof ScreenParams> {
    items: (Item)[],
    renderItem: (item: Item, itemIndex?: number) => JSX.Element,
    renderEmptyItem: () => JSX.Element
    pageMax: number,
    style?: StyleProp<ViewStyle>
    renderEmptyList?: () => JSX.Element
    navParams: NavParams<Screen>
}

interface NavParams<K extends keyof ScreenParams> {
    navigation: Navigation<ScreenParams>;
    destination: K;
    params: ScreenParams[K];
}

export interface State {
    currentPage: number;
}

export default class PagedList<Item, Screen extends keyof ScreenParams> extends React.Component<Props<Item, Screen>, State> {

    constructor(props: Props<Item, Screen>) {
        super(props);

        this.state = {
            currentPage: 0,
        }
    }

    private getItems = () => {
        const start = this.state.currentPage * this.props.pageMax;
        const end = start + this.props.pageMax;
        return this.props.items.slice( start, end);
    }

    render = () => {
        return (
            <ColumnView style={[Class.PagedList_Container, this.props.style]}
            >
                {this.renderItems(this.getItems())}
                {this.renderFooter()}
            </ColumnView>

        );
    }

    private renderItems = (items: Item[]) => {
        if(items.length > 0) {
            let rendered = items.map((item, index) => {
                return this.props.renderItem(item, index);
            })

            while(rendered.length < this.props.pageMax && this.props.items.length > this.props.pageMax) {
                rendered.push(this.props.renderEmptyItem())
            }

            return rendered;
        } else if (this.props.renderEmptyList) {
            return this.props.renderEmptyList();
        }

        return null;
    }

    private renderFooter = () => {
        if(this.props.items.length > this.props.pageMax) {
            return (
                <ColumnView style={Class.PagedList_FooterContainer}>
                    <TouchableView
                        style={Layout.Left_Second_Margin }
                        onPress={() => {
                            const { navigation, destination, params } = this.props.navParams;
                            navigation.push(destination, params);
                        }}
                    >
                        <HeaderText 
                            style={{
                            }}
                            level={3}
                        >View all ({this.props.items.length})</HeaderText>
                    </TouchableView>
                </ColumnView>
            );
        }

        return null;
    }
}