import React from "react";
import { StyleProp, ViewStyle, StyleSheet, Button, View } from "react-native";
import DataComponent from "src/Components/base/DataComponent";
import ColumnView from "src/Components/Basic/ColumnView";
import RowView from "src/Components/Basic/RowView";
import Style from "src/Style/Style";


interface Props {
    accessibilityLabel: string;
    style: StyleProp<ViewStyle>;
    allowSwiping: boolean;
    useButtons: boolean;
    wizardPlacement: "header" | "footer";
    isNextAvailable?: () => boolean;
    isPrevAvailable?: () => boolean;
    data: Data | false;
    onDataChange: (d: Data) => void;
    views: (() => JSX.Element)[];
    wizardHeight?: number;
}

function Default(): Data {
    return {
        currentView: 0,
    };
}

interface Data {
    currentView: number;
}

interface State extends Data {

}

const localStyle = StyleSheet.create({
    hidden: {
        display: "none",
    }
})

export default class ViewWizard extends DataComponent<Props, State, Data> {
    constructor(props: Props) {
        super(props);

        this.state = Default();
    }


    render = () => {
        return (
            <ColumnView 
                style={[this.props.style]}
                accessibilityLabel={this.props.accessibilityLabel}
            >
                {this.renderHeader()}
                {this.renderViews()}
                {this.renderFooter()}
            </ColumnView>
        );
    }

    renderHeader = () => {
        if(this.props.wizardPlacement === "header") {
            return (
                this.renderWizard()
            );
        }
    }

    renderFooter = () => {
        if(this.props.wizardPlacement === "footer") {
            return (
                this.renderWizard()
            );
        }
    }

    renderWizard = () => {
        let style;
        if(this.props.wizardPlacement === "header") {
            style = {
                marginBottom: 20,
                paddingTop: 30,
                borderBottomWidth: 2,
            }
        } else {
            style = {
                marginBottom: 30,
                paddingTop: 20,
                borderTopWidth: 2,
            }
        }

        return (
            <RowView style={[ {
                flex: 0,
                height: this.props.wizardHeight || "auto",
                borderColor: "lightgrey",
                ...style
            }]}>
                <ColumnView style={{
                    alignItems:"center"
                }}>
                    {this.renderPrev()}
                </ColumnView>

                <RowView
                    style={{
                        alignItems:"center",
                        justifyContent: "space-around",
                    }}
                >
                    {this.renderDots()}
                    
                </RowView>
                <ColumnView style={{
                    alignItems: "center"
                }}>
                    {this.renderNext()}
                </ColumnView>
            </RowView>
        );
    }

    renderNext = () => {
        const disabled = this.data().currentView === this.props.views.length - 1;
        return (
            <Button 
                disabled={disabled}
                title={"Next"}
                onPress={() => {
                    this.setData({
                        currentView: this.data().currentView + 1,
                    });
                }}
            ></Button>
        )
    }

    renderPrev = () => {
        const disabled = this.data().currentView === 0;
        return (
            <Button 
                disabled={disabled}
                title={"Prev"}
                onPress={() => {
                    this.setData({
                        currentView: this.data().currentView - 1
                    });
                }}
            ></Button>
        );
    }

    renderDots = () => {
        return this.props.views.map((_renderFn, index) => {
            const borderColor = "grey";
            const backgroundColor = this.data().currentView === index ? borderColor : "white"
            return (
                <View style={{
                    flex: 0,
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    borderColor: borderColor,
                    borderWidth: 2,
                    backgroundColor: backgroundColor
                }}></View>
            )
        });
    }

    renderViews = () => {
        return this.props.views.map((renderFn, index) => {
            return (
                <ColumnView style={[this.viewContainerStyle(index)]}>
                    {renderFn()}
                </ColumnView>
            );
        });
    }

    viewContainerStyle = (index: number) => {
        if(index !== this.data().currentView) {
            return localStyle.hidden;
        }
    }
}



export { ViewWizard, Default }