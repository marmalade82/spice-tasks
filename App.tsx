import React from 'react';
import * as Screens from "src/Screens";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Button, requireNativeComponent } from "react-native";
import { Schedule } from "./Schedule";


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

    void Schedule.refreshStreakGoals(15, () => false );
  }

  render = () => {
    return <AppContainer></AppContainer>
  }
}
