import React from "react";
import { Layout, Type, StyleSheetContext } from "src/Components/Styled/StyleSheets";

import { ColumnView, RowView, RowReverseView, HeaderText, BodyText } from "src/Components/Basic/Basic";
import { View, Text, StyleProp, ViewStyle, ScrollView, } from "react-native";
import { Icon as ElIcon } from "react-native-elements";

interface Props {
    headerText: string;
    bodyText: () => JSX.Element;
    style: StyleProp<ViewStyle>
    footerElements: (() => JSX.Element)[]
    iconType?: "goal" | "task" | "reward" | "penalty" | "earned_reward" | "earned_penalty";
}

interface State {

}

export default class Summary extends React.Component<Props, State> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
                <ColumnView style={[Class.Summary_Container, this.props.style]}>
                    <ScrollView style={{
                    }}>
                        <RowView style={[Class.Summary_HeaderContainer, Layout.CENTERED_SECONDARY]}>
                            <RowView style={[{
                                flex: 1,
                            }, Layout.CENTERED_SECONDARY]}>
                                <HeaderText 
                                    level={3} 
                                    style={Class.Summary_HeaderText}
                                >
                                    {this.props.headerText}
                                </HeaderText>
                            </RowView>
                            <RowView style={[Class.Summary_HeaderIconContainer ]}>
                                {this.props.footerElements.map((render) => {
                                    return (
                                        <View
                                            style={Class.Summary_HeaderIcon}
                                        >
                                            {render()}
                                        </View>
                                    );
                                })}
                            </RowView>
                        </RowView>
                        <RowView style={Class.Summary_BodyContainer}>
                            {this.props.bodyText()}
                        </RowView>
                    </ScrollView>
                    
                </ColumnView>
        )
    }
}