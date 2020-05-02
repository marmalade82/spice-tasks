import React from "react";
import { Layout, Type, Class, Custom } from "src/Components/Styled/StyleSheets";

import { 
    ColumnView, RowView, RowReverseView, 
    HeaderText, BodyText, TouchableView,
} from "src/Components/Basic/Basic";
import Icon from "src/Components/Styled/Icon";

interface Props {
    text: string;
    iconType: "complete" | "delete" | "goal" | "task" | 
        "reward" | "penalty" | "fail" | "none" | 
        "habit" | "edit" | "enable" | "disable";
    iconBackground?: string;
    accessibilityLabel: string;
    onPress: () => void;

}

interface State {

}

export default class ModalRow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <RowView style={Class.ModalRow_Container}>
                <TouchableView
                    style={{flex: 1}} 
                    onPress={this.props.onPress}
                    accessibilityLabel={this.props.accessibilityLabel ? this.props.accessibilityLabel : undefined}
                >
                    <RowView
                        style={[Class.ModalRow_Content, Layout.CENTERED_SECONDARY]}
                    >
                        {this.renderIcon()}
                        <HeaderText
                            style={Layout.Left_First_Margin}
                            level={3}
                        >
                            {this.props.text}
                        </HeaderText>
                    </RowView>
                </TouchableView>
            </RowView>
        );
    }

    renderIcon = () => {
        if(this.props.iconType === "none" ) {
            return null;
        } else {
            return (
                <Icon
                    type={this.props.iconType}
                    accessibilityLabel={this.props.accessibilityLabel}
                    {...Custom.ModalRow_Icon}
                    {...(this.props.iconBackground && { backgroundColor: this.props.iconBackground })}
                >
                </Icon>
            )
        }
    }
}