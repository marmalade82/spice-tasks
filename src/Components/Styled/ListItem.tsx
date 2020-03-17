import React from "react";
import { 
    ColumnView, RowView, RowReverseView, 
    HeaderText, BodyText, TouchableView as TouchableOpacity 
} from "src/Components/Basic/Basic";
import { View, Text } from "react-native";
import { Icon as NIcon } from "react-native-elements";
import { Icon } from "src/Components/Styled/Styled";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props {
    navigation: Navigation<ScreenParams>;
    destination: string;
    params: object;
    text: string;
    subtext: string;
    number: number;
    key: string;
    accessibilityLabel?: string;
    type?: "goal" | "task" | "reward" | "penalty" | "recur" | "earned_reward" | "earned_penalty";
    footerIcons? : (() => JSX.Element)[]
}

export default class ListItem extends React.Component<Props> {
    constructor(props: Props) {
        super(props)
    }

    render = () => {
        const {text, subtext, number} = this.props;
        return (
            <ColumnView
                style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "lightgrey",
                    backgroundColor: "white",
                }}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                <TouchableOpacity style={{
                        flex: 0
                    }}
                    onPress={() =>  {
                        this.props.navigation.push(this.props.destination, this.props.params)
                    }}
                >
                    <RowView style={{
                        justifyContent: "flex-start",
                        paddingLeft: 15,
                        paddingRight: 15,
                        alignItems: "stretch",
                    }}>
                        <RowView style={{
                            flex: 1,
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}>
                            <Icon
                                type={this.props.type ? this.props.type : "none"}
                                backgroundColor={"transparent"}
                            ></Icon>
                            <Text style={{
                                    margin: 15,
                                    marginLeft: 9,
                                }}
                            >
                                <HeaderText 
                                    level={3} 
                                    style={{
                                        
                                    }}
                                >
                                    {text + "\n"}
                                </HeaderText>
                                <HeaderText level={5} style={{
                                    }}
                                > 
                                    {subtext} 
                                </HeaderText>
                            </Text>
                        </RowView>

                        <RowReverseView style={{
                            flex: 0,
                            justifyContent: "flex-start",
                            minWidth: 60,
                            alignItems: "center",
                        }}>
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
