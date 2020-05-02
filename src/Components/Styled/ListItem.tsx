import React from "react";
import { 
    ColumnView, RowView, RowReverseView, 
    HeaderText, BodyText, TouchableView as TouchableOpacity 
} from "src/Components/Basic/Basic";
import { View, Text } from "react-native";
import { Icon as NIcon } from "react-native-elements";
import { Icon } from "src/Components/Styled/Styled";
import { Navigation, ScreenParams } from "src/common/Navigator";
import { Class } from "./StyleSheets";

interface Props<T extends keyof ScreenParams> {
    navigation: Navigation<ScreenParams>;
    destination: T;
    params: ScreenParams[T];
    text: string;
    subtext: string;
    subtext_2?: string;
    number: number;
    key: string;
    accessibilityLabel?: string;
    type?: "goal" | "task" | "reward" | "penalty" | "recur" | "earned_reward" | "earned_penalty" |
            "complete" | "not-complete" | "in-progress" | "none";
    color?: string;
    size?: number;
    footerIcons? : (() => JSX.Element)[]
}

export default class ListItem<T extends keyof ScreenParams> extends React.Component<Props<T>> {
    constructor(props: Props<T>) {
        super(props)
    }

    render = () => {
        const {text, subtext, subtext_2, number} = this.props;
        return (
            <ColumnView
                style={[Class.ListItem_Container]}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                <TouchableOpacity style={{
                        flex: 0
                    }}
                    onPress={() =>  {
                        this.props.navigation.push(this.props.destination, this.props.params)
                    }}
                >
                    <RowView style={Class.ListItem_DisplayContainer}>
                        <RowView style={Class.ListItem_Main}>
                            <Icon
                                type={this.props.type ? this.props.type : "none"}
                                backgroundColor={"transparent"}
                                color={this.props.color}
                                size={this.props.size}
                            ></Icon>
                            <ColumnView
                                style={Class.ListItem_TextContainer}
                            >
                                <HeaderText 
                                    level={3} 
                                    style={Class.ListItem_MainText }
                                >
                                    {text}
                                </HeaderText>
                                <RowView
                                    style={Class.ListItem_SubTextContainer }
                                >
                                    <HeaderText level={5} style={{
                                            flex: 1,
                                            ...Class.ListItem_Subtext,
                                        }}
                                    > 
                                        {subtext} 
                                    </HeaderText>
                                    <HeaderText level={5} style={{
                                            flex: 0,
                                            ...Class.ListItem_Subtext,
                                        }}
                                    > 
                                        {subtext_2 ? subtext_2 : ""} 
                                    </HeaderText>
                                </RowView>
                            </ColumnView>
                        </RowView>

                        <RowReverseView style={Class.ListItem_IconContainer}>
                            {this.renderFooterIcons()}
                        </RowReverseView>
                    </RowView>
                </TouchableOpacity>
            </ColumnView>
        )
    }

    renderFooterIcons = () => {
        if(this.props.footerIcons) {
            return this.props.footerIcons.map((render) => render());
        } else {
            return (
                <Icon
                    type={"none"}
                    backgroundColor={"transparent"}
                ></Icon>
            )
        }
    }
}
