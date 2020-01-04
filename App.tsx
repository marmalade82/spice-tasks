import React from 'react';
import * as Screens from "src/Screens";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Button } from "react-native";

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
