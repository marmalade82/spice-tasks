import React from "react";
import { RowView, HeaderText, TouchableView } from "../Basic/Basic";
import { ROW_CONTAINER_HEIGHT, LEFT_SECOND_MARGIN, TEXT_GREY, LEFT_FIRST_MARGIN, TEXT_HORIZONTAL_MARGIN, RIGHT_SECOND_MARGIN } from "../Styled/Styles";
import { Icon } from "../Styled/Icon";

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
                style={{
                    flex: 0,
                    width: "100%",
                    height: 1.2 * ROW_CONTAINER_HEIGHT,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingLeft: LEFT_FIRST_MARGIN,
                    paddingRight: RIGHT_SECOND_MARGIN,
                }}
                accessibilityLabel={"empty-list"}
            >
                <Icon type={this.props.type ? this.props.type :"complete"}
                    accessibilityLabel={"empty-list-icon"}
                    color={"green"}
                    backgroundColor={"transparent"}
                    size={30}
                ></Icon>
                <HeaderText
                    style={{
                        marginLeft: TEXT_HORIZONTAL_MARGIN,
                        color: TEXT_GREY,
                    }}
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