import React from "react";
import { ColumnView, RowView, BodyText, HeaderText, TouchableView } from "src/Components/Basic/Basic";
import MyDate from "src/common/Date";
import { NavigationRow, ScreenHeader, DocumentView } from "src/Components/Styled/Styled";
import { CONTAINER_VERTICAL_MARGIN, ROW_CONTAINER_HEIGHT, Styles, LEFT_SECOND_MARGIN, PRIMARY_COLOR_LIGHT } from "./Styles";
import { StyleProp, ViewStyle } from "react-native";

interface Props {
    navigation: any
    rows: Row[]
    style?: StyleProp<ViewStyle>
}

interface State {
}

interface Row {
    text: string;
    number?: number;
    icon?: "goal" | "task" | "reward" | "penalty" | "recur";
    navParams: object;
    navDestination: string;
    navType?: "navigate" | "push";
}

export default class NavigationGroup extends React.Component<Props, State> {
    constructor(props: Props) {
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

                const { number, icon, text, navParams, navDestination, navType } = row;
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
                    >
                    </NavigationRow>
                );
            })
        );
    }
}