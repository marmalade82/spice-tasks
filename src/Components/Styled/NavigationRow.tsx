import React from "react";
import { Layout, Type, StyleSheetContext} from "src/Components/Styled/StyleSheets";

import { View, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText } from "src/Components/Basic/Basic";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";
import StyledIcon from "./Icon";
import { Navigation, ScreenParams } from "src/common/Navigator";

interface Props<T extends keyof ScreenParams> {
    number?: number;
    icon?: "goal" | "task" | "reward" | "penalty" | "recur" | "earned_reward" | "earned_penalty" | "settings";
    text: string;
    navOptions?: navOptions<T>
    style?: StyleProp<ViewStyle>
    accessibilityLabel?: string;
}

interface navOptions<T extends keyof ScreenParams> {
    navigation: Navigation<ScreenParams>
    destination: T,
    parameters: ScreenParams[T],
    type: "push" | "navigate",
}


export default class NavigationRow<T extends keyof ScreenParams> extends React.Component<Props<T>> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>

    constructor(props: Props<T> ) {
        super(props);
    }

    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <View
                style={[Class.NavigationRow_Container, this.props.style]}
            >
                {this.renderContent()}
            </View>
        );
    }

    renderContent = () => {
        if(this.props.navOptions) {
            const { navigation, destination, parameters, type} = this.props.navOptions
            return (
                    <ClickNavigation
                        style={{
                            flex: 0,
                            backgroundColor: "transparent",
                        }}
                        navigation={navigation}
                        destination={destination}
                        parameters={parameters}
                        navType={type}
                        accessibilityLabel={this.props.accessibilityLabel}
                    >
                        {this.renderRow()}
                    </ClickNavigation>
            );
        } else {
            return this.renderRow();
        }

    }
    
    renderRow = () => {
        const { Class, Common, Custom } = this.context;
        return (
                <RowView style={[Class.NavigationRow_RowContainer, Layout.CENTERED_SECONDARY]}>
                    { this.renderThumbnail() }
                    <HeaderText level={3} style={Class.NavigationRow_RowText }>
                        {this.props.text}
                    </HeaderText>
                </RowView>
        )
    }

    renderThumbnail = () => {
        const { Class, Common, Custom } = this.context;
        if(this.props.number !== undefined) {
            return (
                <View style={[Class.NavigationRow_IconContainer, Layout.CENTERED]}>
                    <HeaderText level={3} style={Class.NavigationRow_IconText }>
                        { this.props.number }
                    </HeaderText>
                </View>
            )
        } else if(this.props.icon) {
            return (
                <StyledIcon
                    type={this.props.icon}
                    {...Custom.NavigationRow_Icon}
                ></StyledIcon>
            );
        }
    }
}