import React from 'react';
import * as Screens from "src/Screens";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Button } from "react-native";
import DB from "src/Models/Database";



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
  render = () => {
    return <AppContainer></AppContainer>
  }
}
