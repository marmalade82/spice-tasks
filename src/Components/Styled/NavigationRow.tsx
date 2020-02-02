import React from "react";

import { View } from "react-native";
import { ColumnView, RowView, BodyText, HeaderText } from "src/Components/Basic/Basic";
import ClickNavigation from "src/Components/Navigation/ClickNavigation";

interface Props {
    number: number;
    text: string;
    navOptions?: navOptions
    key? : any
}

interface navOptions {
    navigation: any
    destination: string,
    parameters: object,
    type: "push" | "navigate",
}


export default class NavigationRow extends React.Component<Props> {

    constructor(props: Props ) {
        super(props);
    }

    render = () => {
            return (
                <View
                    style={{
                        flex: 0,
                        width: "100%",
                        height: 60,
                        marginBottom: 10,
                        backgroundColor: "white",
                        elevation: 5,
                    }}
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
                    >
                        {this.renderRow()}
                    </ClickNavigation>
            );
        } else {
            return this.renderRow();
        }

    }
    
    renderRow = () => {
        return (
                <RowView style={{
                    flex: 0,
                    height: 60,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingLeft: 15,
                }}>
                    <View style={{
                        height: 37,
                        width: 37,
                        borderRadius: 37/2,
                        backgroundColor: "rgb(191,38,0)",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <HeaderText level={3} style={{
                            color: "white",
                        }}>
                            { this.props.number }
                        </HeaderText>
                    </View>
                    <HeaderText level={3} style={{
                        margin: 15,
                        marginLeft: 9,
                    }}>
                        {this.props.text}
                    </HeaderText>
                </RowView>
        )
    }
}