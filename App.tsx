import React from 'react';
import * as Screens from "src/Screens";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Button, AppState } from "react-native";
import { Schedule } from "./Schedule";
import SpiceDBService from 'src/Services/DBService';


const ScreenNavigator = createStackNavigator(
  { Home: {
      screen: Screens.Home,
    }
  , Goal: Screens.Goal
  , Goals: Screens.GoalList
  , Menu: Screens.Menu
  , AddGoal: Screens.AddGoal
  , Recurring: Screens.Recurring
  , Streak: Screens.Streak
  , AddTask: Screens.AddTask
  , Tasks: Screens.TaskList
  , Rewards: Screens.RewardList
  , AddReward: Screens.AddReward
  , Task: Screens.Task
  , Dashboard: Screens.Dashboard
  , RewardOptions: Screens.RewardOptions
  , EarnedReward: Screens.EarnedReward
  , EarnedRewards: Screens.EarnedRewardList
  , Penalties: Screens.PenaltyList
  , AddPenalty: Screens.AddPenalty
  , ClaimedRewards: Screens.ClaimedRewardList
  , HomePage : Screens.HomePage
  , AppStart : Screens.AppStart
  , RemainingTasks : Screens.RemainingTasks
  , Overdue: Screens.Overdue
  , InProgressGoals: Screens.InProgressGoalList
  , SpecificTask: Screens.SpecificTask
  , SpecificTaskLists: Screens.SpecificTaskList
  , Recurrings: Screens.RecurringList
  , Recur: Screens.Recur
  , AddRecur: Screens.AddRecur
  , Test: Screens.Test
  },
  { initialRouteName: 'Home'
  , defaultNavigationOptions: ({navigation}) => {
      return {
        headerRight: () => { return <Button
                onPress={() => {
                    navigation.navigate('Menu');
                }}
                title="Menu"
                color="lightgreen"
            
            />
        }
      }
    }

  }
);

const AppNavigator = createStackNavigator(
  { Main: ScreenNavigator,
    Recurring: Screens.Recurring,
  },
  {
    mode: "modal",
    headerMode: "none",
  }
)

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {

  componentDidMount = () => {
    AppState.addEventListener('change', this.handleAppStateChange);

    void Schedule.refresh(1, () => false);
    //void Schedule.refreshStreakGoals(15, () => false );
  }

  componentWillUnmount = () => {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = (nextState: "active" | "background" | "inactive" | null) => {
    switch(nextState) {
      case "active": {
        SpiceDBService.stopService();
      } break;
      case "background": {
        SpiceDBService.startService();
      } break;
      case "inactive": {
        SpiceDBService.startService();
      } break;
      case null: {
        // do nothing
      } break;
      default: {
        // do nothing
      }
    }

  }

  render = () => {
    return <AppContainer></AppContainer>
  }
}
