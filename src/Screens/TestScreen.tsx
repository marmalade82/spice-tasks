import React from "react";
import { Button, Text } from "react-native";
import { ColumnView, RowView } from "src/Components/Basic/Basic";
import Style from "src/Style/Style";
import { AccordionList } from "src/Components/Basic/Basic";

interface Props {
    navigation: any;
}

interface State {}

const items = [
    {   id: "123"
    ,   title: "first" 
    },
    {   id: "456"
    ,   title: "second"
    }
]

export default class TestScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Test',
        }
    }

    renderHeader = () => {
        return (
            <ColumnView style={{
            }}>
                <RowView style={[Style.yellowBg, {
                    alignItems: "center"
                }]}>
                    <Text>Header</Text>
                </RowView>
            </ColumnView>
        );
    }

    renderItem = (item: {id: string, title: string}) => {
        return (
            <RowView style={[Style.redBg, {
                height: 80,
            }]}>
                <Text>{item.title}</Text>
            </RowView>
        );
    }

    render = () => {
        return (
            <ColumnView style={{
                justifyContent: "flex-start"
            }}>
                <AccordionList
                    renderHeader={this.renderHeader}
                    items={items} 
                    renderItem={this.renderItem}
                    data={false}
                    onDataChange={() => {}}
                    headerStyle={{
                        flex: 0,
                        height: 60,
                    }}
                    bodyStyle={[Style.blueBg, {
                        //flex: 0,
                        //height: 400,
                    }]}
                    accessibilityLabel={"test accordion"}
                >

                </AccordionList>
            </ColumnView>
        );
    }
}