
import React from "react";

import { View, StyleProp, ViewStyle } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText, RowReverseView } from "src/Components/Basic/Basic";
import { TouchableOpacity } from "react-native";
import { Layout, Type, Class, Common } from "src/Components/Styled/StyleSheets";

interface Props {
    number: number;
    text: string;
    onPress?: () => void;
    key?: any;
    rightElements: (() => JSX.Element)[]
    style?: StyleProp<ViewStyle>
    accessibilityLabel?: string;
}

export default class ClickRow extends React.Component<Props> {

    constructor(props: Props ) {
        super(props);
    }

    render = () => {
            return (
                <View
                    style={[{
                        ...Class.ClickRow_Container,
                    }, this.props.style]}
                >
                    {this.renderContent()}
                </View>
            );
    }

    renderContent = () => {
        if(this.props.onPress) {
            //return this.renderRow();
            
            return (
                    <TouchableOpacity
                        style={[Class.ClickRow_Touchable, Layout.CENTERED_PRIMARY]}
                        onPress={this.props.onPress}
                        accessibilityLabel={this.props.accessibilityLabel ? "input-" + this.props.accessibilityLabel : undefined }
                    >
                        {this.renderRow()}
                    </TouchableOpacity>
            );
            
        } else {
            return this.renderRow();
        }

    }
    
    renderRow = () => {
        return (
                <RowView style={[Class.ClickRow_Row, Layout.CENTERED_PRIMARY]}>
                    <RowView style={[Common.PageBackground, Layout.CENTERED_SECONDARY]}>
                        <View style={[{
                            ...Class.StandardIconContainer,
                            ...Common.PrimaryBackground,
                        }, Layout.CENTERED]}>
                            <HeaderText level={3} style={Class.ClickRow_NumberText}>
                                { this.props.number }
                            </HeaderText>
                        </View>
                        <HeaderText level={3} style={Class.ClickRow_Text}>
                            {this.props.text}
                        </HeaderText>

                    </RowView>
                    <RowReverseView style={[Class.ClickRow_RightContainer, Layout.CENTERED_SECONDARY]}>
                        { this.renderRightElements() }
                    </RowReverseView>
                </RowView>
        )
    }
    renderRightElements = () => {
        return this.props.rightElements.map((el) => {
            return (
                el()
            )
        })
    }
}