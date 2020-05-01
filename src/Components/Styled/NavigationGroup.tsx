import React from "react";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { NavigationRow, ScreenHeader, DocumentView } from "src/Components/Styled/Styled";
import { CONTAINER_VERTICAL_MARGIN, } from "./Styles";
import { StyleProp, ViewStyle } from "react-native";
import { Navigation, ScreenParams } from "src/common/Navigator";

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
    icon?: "goal" | "task" | "reward" | "penalty" | "recur" | "earned_reward" | "earned_penalty";
    navParams: ScreenParams[T];
    navDestination: T;
    navType?: "navigate" | "push";
    accessibilityLabel: string;
}

export default class NavigationGroup<T extends keyof ScreenParams> extends React.Component<Props<T>, State> {
    constructor(props: Props<T>) {
        super(props);
    }


    render = () => {
        return (
            <ColumnView
                style={[{
                    flex: 0,
                    backgroundColor: "white",
                    marginBottom: CONTAINER_VERTICAL_MARGIN,
                    elevation: 5
                }, this.props.style]}
            >
                {this.renderRows()}
            </ColumnView>
        )
    }


    renderRows = () => {
        return (
            this.props.rows.map((row, index) => {
                let style;
                if(index === this.props.rows.length - 1) {
                    style = {
                        marginBottom: 0,
                    }
                } else {
                    style= {
                        marginBottom: 0,
                        elevation: 0,
                        borderBottomWidth: 1,
                        borderColor: "lightgrey",
                    }
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