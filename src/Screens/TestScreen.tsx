import React from "react";
import { Button } from "react-native";
import { ColumnView, ViewPicker } from "src/Components/Basic/Basic";
import Style from "src/Style/Style";

interface Props {
    navigation: any;
}

interface State {}

export default class TestScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Test',
        }
    }

    render_1 = () => {
        return {
            title: "View 1",
            render: () => {
                return (
                    <ColumnView style={[Style.yellowBg]}>
                        <Button
                            title="View 1"
                            onPress={() => {}}
                        ></Button>
                    </ColumnView>
                );
            },
        }
    }

    render_2 = () => {
        return {
            title: "View 2",
            render: () => {
                return (
                    <ColumnView style={[Style.blueBg]}>
                        <Button
                            title="View 2"
                            onPress={() => {}}
                        ></Button>
                    </ColumnView>
                );
            },
        }
    }

    render = () => {
        return (
            <ColumnView style={{}}>
                <ViewPicker
                    views={[this.render_1(), this.render_2()]}
                    pickerHeight={75}
                    data={false}
                    onDataChange={() => {}}
                    accessibilityLabel={"test"}
                ></ViewPicker>
            </ColumnView>
        );
    }
}