import React from "react";

import { 
    ColumnView, RowView, RowReverseView, 
    HeaderText, BodyText, TouchableView,
} from "src/Components/Basic/Basic";
import Icon from "src/Components/Styled/Icon";

interface Props {
    text: string;
    iconType: "complete" | "delete";
    accessibilityLabel?: string;
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
            <RowView style={{
                flex: 0,
                height: 50,
                justifyContent: "flex-start",
                alignItems: "stretch",
                paddingLeft: 15,
            }}>
                <TouchableView
                    style={{flex: 1}} 
                    onPress={this.props.onPress}
                    accessibilityLabel={this.props.accessibilityLabel}
                >
                    <RowView
                        style={{
                            flex: 1,
                            justifyContent: "flex-start",
                            alignItems: "center",
                            width: "100%",
                            backgroundColor: "white",
                        }}
                    >
                        <Icon
                            type={this.props.iconType}
                            accessibilityLabel={this.props.accessibilityLabel}
                        >
                        </Icon>
                        <HeaderText
                            style={{
                                marginLeft: 9,
                            }}
                            level={3}
                        >
                            {this.props.text}
                        </HeaderText>
                    </RowView>
                </TouchableView>
            </RowView>
        );
    }
}