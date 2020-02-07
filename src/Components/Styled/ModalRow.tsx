import React from "react";

import { 
    ColumnView, RowView, RowReverseView, 
    HeaderText, BodyText, TouchableView,
} from "src/Components/Basic/Basic";
import Icon from "src/Components/Styled/Icon";
import { LEFT_FIRST_MARGIN, MODAL_ROW_HEIGHT, Styles, TEXT_HORIZONTAL_MARGIN } from "./Styles";

interface Props {
    text: string;
    iconType: "complete" | "delete" | "goal" | "task" | 
        "reward" | "penalty";
    iconBackground?: string;
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
                height: MODAL_ROW_HEIGHT,
                justifyContent: "flex-start",
                alignItems: "stretch",
                paddingLeft: LEFT_FIRST_MARGIN,
            }}>
                <TouchableView
                    style={{flex: 1}} 
                    onPress={this.props.onPress}
                    accessibilityLabel={this.props.accessibilityLabel}
                >
                    <RowView
                        style={[{
                            flex: 1,
                            width: "100%",
                            backgroundColor: "white",
                        }, Styles.CENTERED_SECONDARY]}
                    >
                        <Icon
                            type={this.props.iconType}
                            accessibilityLabel={this.props.accessibilityLabel}
                            backgroundColor={this.props.iconBackground}
                        >
                        </Icon>
                        <HeaderText
                            style={{
                                marginLeft: TEXT_HORIZONTAL_MARGIN,
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