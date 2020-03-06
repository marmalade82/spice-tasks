import React from 'react';
import * as Screens from "src/Screens";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from "react-navigation-drawer";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Button, AppState } from "react-native";
import { Schedule } from "./Schedule";
import SpiceDBService from 'src/Services/DBService';

const ScreenDirectory = {
  Home: {
      screen: Screens.Home,
    }
  , Goal: Screens.Goal
  , Goals: Screens.GoalList
  , Menu: Screens.Menu
  , AddGoal: Screens.AddGoal
  , Streak: Screens.Streak
  , AddTask: Screens.AddTask
  , Tasks: Screens.TaskList
  , Reward: Screens.Reward
  , Rewards: Screens.RewardList
  , AddReward: Screens.AddReward
  , Task: Screens.Task
  , Dashboard: Screens.Dashboard
  , RewardOptions: Screens.RewardOptions
  , EarnedReward: Screens.EarnedReward
  , EarnedRewards: Screens.EarnedRewardList
  , UnusedEarnedRewards: Screens.UnusedEarnedRewards
  , Penalty: Screens.Penalty
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
  , EarnedPenalties: Screens.EarnedPenaltyList
  , EarnedPenalty: Screens.EarnedPenalty
  , UnusedEarnedPenalties: Screens.UnusedEarnedPenalties
  , Lists: Screens.Lists
  , Test: Screens.Test
  
};

const ScreenNavigator = createStackNavigator(
  ScreenDirectory,
  { initialRouteName: 'Home'
  , defaultNavigationOptions: ({navigation}) => {
      return {
        headerRight: () => { return <Button
                onPress={() => {
                    //navigation.navigate('Menu');
                    navigation.toggleDrawer();
                }}
                title="Menu"
                color="lightgreen"
            
            />
        }
      }
    }

  }
);

const DashNavigator = createStackNavigator(
  ScreenDirectory,
  { initialRouteName: 'AppStart'
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

const ListNavigator = createStackNavigator(
  ScreenDirectory,
  { initialRouteName: 'Lists'
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
)

const AppNavigator = createBottomTabNavigator(
  {
    Dash: DashNavigator,
    Lists: ListNavigator
  }
);

/*const AppNavigator = createDrawerNavigator(
  { Main: ScreenNavigator,
    AppStart: Screens.AppStart,
    Tasks: Screens.TaskList,
    Goals: Screens.GoalList,
    Rewards: Screens.RewardList,
    Penalties: Screens.PenaltyList,
    EarnedRewards: Screens.EarnedRewardList,
    EarnedPenalties: Screens.EarnedPenaltyList,
  },
  { drawerPosition: "left"

  }
);*/
/*
const AppNavigator = createStackNavigator(
  { Main: ScreenNavigator,
    Recurring: Screens.Recurring,
  },
  {
    mode: "modal",
    headerMode: "none",
  }
)*/

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {

  componentDidMount = () => {
    AppState.addEventListener('change', this.handleAppStateChange);

    void Schedule.refresh(1, () => false);
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
