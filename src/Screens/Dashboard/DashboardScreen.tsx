import React from "react";
import { ColumnView } from "src/Components/Basic/Basic";
import { ConnectedGoalTaskList } from "src/ConnectedComponents/Lists/Composite/GoalTaskList";





interface Props {
    navigation: any;
}

interface State {

}

export default class DefaultScreen extends React.Component<Props, State> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Dashboard',
        }
    }

    constructor(props: Props) {
        super(props);
    }

    render = () => {
        return (
            <ColumnView style={[]}>
                <ConnectedGoalTaskList
                    navigation={this.props.navigation}
                >
                </ConnectedGoalTaskList>
            </ColumnView>
        );
    }
}


