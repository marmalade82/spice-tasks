import React from "react";
import { RowView, HeaderText, TouchableView } from "../Basic/Basic";
import { Icon } from "../Styled/Icon";
import { Layout, Type, Class, Custom } from "src/Components/Styled/StyleSheets";

export interface Props {
    text: string;
    type?: "add" | "complete"
}

export interface State {

}

export default class EmptyList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <RowView
                style={[Class.EmptyList_Container]}
                accessibilityLabel={"empty-list"}
            >
                <Icon type={this.props.type ? this.props.type :"complete"}
                    accessibilityLabel={"empty-list-icon"}
                    {...Custom.EmptyList_Icon}
                ></Icon>
                <HeaderText
                    style={[Class.EmptyList_Header]}
                    level={3}
                >
                    {this.props.text}
                </HeaderText>
            </RowView>
        );
    }
}

interface PlusProps extends Props {
    onPress: () => void;
}

export class PlusEmptyList extends React.Component<PlusProps> {

    render = () => {
        return (
            <TouchableView
                style={{}}
                onPress={this.props.onPress}
            >
                <EmptyList
                    text={this.props.text}
                    type={this.props.type}
                ></EmptyList>
            </TouchableView>
        )
    }
}