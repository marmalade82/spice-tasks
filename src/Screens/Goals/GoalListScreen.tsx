import React from "react";
import { ConnectedGoalList } from "src/ConnectedComponents/Lists/Goal/GoalList";
import { DocumentView, Icon } from "src/Components/Styled/Styled";
import { GoalLogic } from "src/Models/Goal/GoalQuery";
import { EventDispatcher } from "src/common/EventDispatcher";
import { HeaderAddButton } from "src/Components/Basic/HeaderButtons";
import { getKey } from "../common/screenUtils";
import { FullNavigation, MainNavigator, ScreenNavigation } from "src/common/Navigator";



interface Props {
    navigation: object;
}

const dispatcher = new EventDispatcher();

export default class GoalListScreen extends React.Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Goals',
            right: [
                () => {
                    return (
                        <HeaderAddButton
                            dispatcher={dispatcher}
                            eventName={getKey(navigation)}
                        ></HeaderAddButton>
                    )
                }
            ]
        }
    }

    navigation: MainNavigator<"Goals">;
    constructor(props: Props) {
        super(props);
        this.state = {

        };

        this.navigation = new ScreenNavigation(props);
    }

    componentDidMount = () => {
        dispatcher.addEventListener(getKey(this.navigation), this.onClickAdd);
    }

    componentWillUnmount = () => {
        dispatcher.removeEventListener(getKey(this.navigation) , this.onClickAdd);
    }

    onClickAdd = () => {
        const params = {
            id: "",
            parent_id: "",
        };
        this.navigation.navigate('AddGoal', params);
    }

    onGoalAction = (id: string, action: "complete" | "fail") => {
        switch(action) {
            case "complete": {
                new GoalLogic(id).complete();
            } break;
            case "fail" : {
                new GoalLogic(id).fail();
            } break;
        }
    }

    render = () => {
        return (
            <DocumentView>
                <ConnectedGoalList 
                    navigation={this.navigation}
                    onGoalAction = {this.onGoalAction}
                >
                </ConnectedGoalList>
            </DocumentView>
        );
    }
}
