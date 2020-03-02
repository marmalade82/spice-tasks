import React from "react";
import { ColumnView, RowView, TouchableView, BodyText } from "src/Components/Basic/Basic";
import { ROW_CONTAINER_HEIGHT, CONTAINER_ELEVATION } from "src/Components/Styled/Styles";
import { Button, StyleProp, ViewStyle } from "react-native";
import { Icon } from "src/Components/Styled/Icon";




export interface Props<Item> {
    items: Item[],
    renderItem: (item: Item) => JSX.Element,
    renderEmpty: () => JSX.Element
    pageMax: number,
    style?: StyleProp<ViewStyle>
}

export interface State {
    currentPage: number;
}

export default class PagedList<Item> extends React.Component<Props<Item>, State> {

    constructor(props: Props<Item>) {
        super(props);

        this.state = {
            currentPage: 0,
        }
    }

    getItems = () => {
        const start = this.state.currentPage * this.props.pageMax;
        const end = start + this.props.pageMax;
        return this.props.items.slice( start, end);
    }

    lastPage = () => {
        const last = Math.ceil(this.props.items.length / this.props.pageMax) - 1;
        this.setState({
            currentPage: last,
        })
    }

    nextPage = () => {
        const newStart = (this.state.currentPage + 1) * this.props.pageMax;
        if(newStart < this.props.items.length) {
            this.setState((prevState) => {
                return {
                    currentPage: prevState.currentPage + 1,
                };
            });
        }
    }

    prevPage = () => {
        const newStart = (this.state.currentPage - 1) * this.props.pageMax;
        if(newStart >= 0) {
            this.setState((prevState) => {
                return {
                    currentPage: prevState.currentPage - 1,
                };
            });
        }
    }

    firstPage = () => {
        this.setState({
            currentPage: 0,
        })
    }

    render = () => {
        return (
            <ColumnView style={[
                {   elevation: CONTAINER_ELEVATION,
                    flex: 0,
                    backgroundColor: "white",
                }, this.props.style]}
            >
                {this.renderItems(this.getItems())}

                <ColumnView style={{flex: 0, height: ROW_CONTAINER_HEIGHT, justifyContent: "center"}}>
                    <RowView style={{
                        flex: 0,
                    }}
                        
                    >
                        <TouchableView style={{}}
                            onPress={() => this.firstPage()}
                        >
                            <Icon
                                type={"last"}
                                backgroundColor={"transparent"}
                            ></Icon>
                        </TouchableView>
                        <TouchableView style={{}}
                            onPress={() => this.prevPage()}
                        >
                            <Icon
                                type={"left"}
                                backgroundColor={"transparent"}
                            ></Icon>
                        </TouchableView>

                        {this.renderFooter()}

                        <TouchableView style={{}}
                            onPress={() => this.nextPage()}
                        >
                            <Icon
                                type={"right"}
                                backgroundColor={"transparent"}
                            ></Icon>
                        </TouchableView>
                        <TouchableView style={{}}
                            onPress={() => this.lastPage()}
                        >
                            <Icon
                                type={"first"}
                                backgroundColor={"transparent"}
                            ></Icon>
                        </TouchableView>
                    </RowView>
                </ColumnView>
            </ColumnView>

        );
    }

    renderItems = (items: Item[]) => {
        let rendered = items.map((item) => {
            return this.props.renderItem(item);
        })

        while(rendered.length < this.props.pageMax) {
            rendered.push(this.props.renderEmpty())
        }

        return rendered;
    }

    renderFooter = () => {
        if(this.props.items.length > this.props.pageMax) {
            return (
                <ColumnView 
                    style={{ 
                        flex: 0,
                        backgroundColor: "white",
                    }}
                >
                    {this.renderPageLocation()}
                </ColumnView>
            );
        } else {
            return null;
        }
    }

    renderPageLocation = () => {
        const text = `${this.state.currentPage + 1} of ${ Math.ceil(this.props.items.length / this.props.pageMax) }`
        return (
            <BodyText style={{}}>{text}</BodyText>
        );
    }
}