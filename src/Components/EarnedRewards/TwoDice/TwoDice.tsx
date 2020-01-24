import React from "react";
import { 
    ColumnView, RowView, Image, 
    HeaderText, BodyText, ViewWizard 
} from "src/Components/Basic/Basic";
import { Button, Text, View, FlatList} from "react-native";
import TwoDiceRoll from "src/Components/EarnedRewards/TwoDice/TwoDiceRoll";

interface Props { }

interface State  { }

export default class TwoDice extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <ViewWizard
                accessibilityLabel={"test view wizard"}
                style={{
                    flex: 14
                }}
                allowSwiping={false}
                useButtons={true}
                wizardPlacement={"footer"}
                data={false}
                onDataChange={() => {}}
                views={this.renderViews()}
            >

            </ViewWizard>
        );
    }

    renderViews = () => {
        return [
            () => {
                return (
                    <ColumnView style={{}}>
                        <FlatList
                            style={{
                                width: "100%",
                                backgroundColor: "pink"
                            }}
                            data={[
                                { key: "2", text: "Goal 2", number: "2"},
                                { key: "3", text: "Goal 3", number: "3"},
                                { key: "4", text: "Goal 4", number: "4"},
                                { key: "5", text: "Goal 5", number: "5"},
                                { key: "6", text: "Goal 6", number: "6"},
                                { key: "7", text: "Goal 7", number: "7"},
                                { key: "8", text: "Goal 8", number: "8"},
                                { key: "9", text: "Goal 9", number: "9"},
                                { key: "10", text: "Goal 10", number: "10"},
                                { key: "11", text: "Goal 11", number: "11"},
                                { key: "12", text: "Goal 12", number: "12"},
                            ] } 
                            renderItem={({item}) => {
                                return (
                                    <ColumnView style={{
                                        backgroundColor: "purple",
                                    }}>
                                        <RowView style={{
                                            backgroundColor: "brown"
                                        }}>
                                            <ColumnView style={{
                                                backgroundColor: "pink",
                                                flex: 0,
                                                width: 80,
                                                alignItems: "center",
                                            }}>
                                                <View style={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: 30,
                                                    backgroundColor: "lightgreen",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}>
                                                    <BodyText style={{}}>{item.number}</BodyText>
                                                </View>
                                            </ColumnView>
                                            <ColumnView style={{
                                                alignItems: "flex-start",
                                            }}>
                                                <BodyText style={{}}>{item.text}</BodyText>
                                            </ColumnView>
                                        </RowView>
                                    </ColumnView>
                                );
                            }}
                        >

                        </FlatList>
                    </ColumnView>
                );
            },
            () => {
                return (
                    <TwoDiceRoll></TwoDiceRoll>
                )
            },
            () => {
                return (
                    <ColumnView style={{}}><Text>Hi 3</Text></ColumnView>
                )
            },
        ];
    }
}