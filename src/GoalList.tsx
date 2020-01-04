import React from "react";
import { View, Text, FlatList } from "react-native";


interface Props {
    style: any
}

interface State {
    data: any[]
}

export default class GoalList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            data: [
                { key: "1"
                , title: "Finish Harry Potter Book 5"
                },
                { key: "2"
                , title: "Complete config of Shopify store"
                }
                
            ],
        }
    }

    renderGoal = (goal: any) => {
        return (
            <View>
                <Text>{goal.title}</Text>
            </View>
        )
    }

    render = () => {
        return (
            <View style={[this.props.style]}>
                <FlatList
                    data={this.state.data} 
                    renderItem={({item}) => {return this.renderGoal(item)}}
                />


            </View>
        );
    }

}