import React from "react";
import { FlatList, Text } from "react-native";

interface Props {
    style: any
}

interface State {
    data: any[]
}

class Rewards extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

    }

    state = {
        data: [
            { summary: "Ice cream", date: "12/20/2019" }, 
            { summary: "Turtles", date: "12/15/2019" },
            { summary: "PANTHER", date: "15-15-2019"}
        ]
    }

    renderItem = (item: {summary: string, date: string}) => {
        return (
            <Text style={this.props.style}>
                {item.summary}
            </Text>
        );
    }

    render = () => {

        return (
            <FlatList data={this.state.data} 
                      renderItem={({item}) => this.renderItem(item)}
                      keyExtractor={(item) => {return item.summary}}>
            </FlatList>

        )
    }

}

export default Rewards;