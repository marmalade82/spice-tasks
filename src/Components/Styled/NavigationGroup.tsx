import React from "react";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView } from "src/Components/Basic/Basic";
import { NavigationRow, ScreenHeader, DocumentView } from "src/Components/Styled/Styled";
import { StyleProp, ViewStyle } from "react-native";
import { Navigation, ScreenParams } from "src/common/Navigator";
import { StyleSheetContext } from "./StyleSheets";

interface Props<T extends keyof ScreenParams> {
    navigation: Navigation<ScreenParams>
    rows: (Row<T>)[]
    style?: StyleProp<ViewStyle>
}

interface State {
}

interface Row<T extends keyof ScreenParams> {
    text: string;
    number?: number;
    icon?: "goal" | "task" | "reward" | "penalty" | "recur" | "earned_reward" | "earned_penalty" | "settings";
    navParams: ScreenParams[T];
    navDestination: T;
    navType?: "navigate" | "push";
    accessibilityLabel: string;
}

export default class NavigationGroup<T extends keyof ScreenParams> extends React.Component<Props<T>, State> {
    static contextType = StyleSheetContext;
    context!: React.ContextType<typeof StyleSheetContext>
    constructor(props: Props<T>) {
        super(props);
    }


    render = () => {
        const { Class, Common, Custom } = this.context;
        return (
            <ColumnView
                style={[Class.NavigationGroup_Container, this.props.style]}
            >
                {this.renderRows()}
            </ColumnView>
        )
    }


    renderRows = () => {
        const { Class, Common, Custom } = this.context;
        return (
            this.props.rows.map((row, index) => {
                let style;
                if(index === this.props.rows.length - 1) {
                    style = Class.NavigationGroup_LastRow;
                } else {
                    style= Class.NavigationGroup_Row;
                }

                const { number, icon, text, navParams, 
                    navDestination, navType ,
                    accessibilityLabel,
                } = row;
                return (
                    <NavigationRow
                        number={number}
                        icon={icon}
                        text={text}
                        navOptions={{
                            navigation: this.props.navigation,
                            destination: navDestination,
                            parameters: navParams,
                            type: navType ? navType : "navigate",
                        }}
                        key={index}
                        style={
                            style
                        }
                        accessibilityLabel={accessibilityLabel}
                    >
                    </NavigationRow>
                );
            })
        );
    }
}