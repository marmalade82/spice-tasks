import React from 'react';
import * as Screens from "src/Screens";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, HeaderBackButton, HeaderProps } from 'react-navigation-stack';
import { createDrawerNavigator } from "react-navigation-drawer";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Button, AppState } from "react-native";
import { Schedule } from "./Schedule";
import SpiceDBService from 'src/Services/DBService';
import { 
  PRIMARY_COLOR_LIGHT, PRIMARY_COLOR, LEFT_FIRST_MARGIN, LEFT_SECOND_MARGIN,
  Styles, ROW_CONTAINER_HEIGHT, TEXT_GREY, TAB_GREY,
} from 'src/Components/Styled/Styles';
import { IconButton, Icon, ScreenHeader } from 'src/Components/Styled/Styled';

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

export type Single = {
  id: string;
}

export type Child = {
  parent_id: string,
  id: string
}

export type None = {

}


/*
const Single = {
  id: "", 
}

const Child = {
  id: "",
  parent_id: "",
}


const NavigatorParams = {
    Home: undefined
  , Goal: Single
  , Goals: undefined
  , Menu: undefined
  , AddGoal: Child
  , Streak: undefined
  , AddTask: Child
  , Tasks: undefined
  , Reward: Single
  , Rewards: undefined
  , AddReward: Child
  , Task: Single
  , Dashboard: undefined
  , RewardOptions: undefined
  , EarnedReward: Single
  , EarnedRewards: undefined
  , UnusedEarnedRewards: undefined
  , Penalty: Single
  , Penalties: undefined
  , AddPenalty: Child
  , ClaimedRewards: undefined
  , HomePage : undefined
  , AppStart : undefined
  , RemainingTasks : undefined
  , Overdue: undefined
  , InProgressGoals: undefined
  , SpecificTask: undefined
  , SpecificTaskLists: undefined
  , Recurrings: undefined
  , Recur: Single
  , AddRecur: Child
  , EarnedPenalties: undefined
  , EarnedPenalty: Single
  , UnusedEarnedPenalties: undefined
  , Lists: undefined
  , Test: undefined
} as const;

export type NavigatorTypes = typeof NavigatorParams;
*/

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
        },
        headerStyle: {
          backgroundColor: PRIMARY_COLOR,
        }

      }
    }

  }
);

const header = ({scene, navigation}) => {
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title : "";
  const right = options.right;
  return (
    <ScreenHeader
      navigation={navigation}
      showBack={ navigation.state.index !== 0 }
      right={right}
    >{title}</ScreenHeader>
  );
};


const DashNavigator = createStackNavigator(
  ScreenDirectory,
  { initialRouteName: 'AppStart'
  , defaultNavigationOptions: ({navigation}) => {
      return {
        header: header        
      }
    }

  }
);

DashNavigator.navigationOptions = {
  title: "Home",
  tabBarIcon: ( { focused, horizontal, tintColor }) => {
    return (
      <Icon
        type={"home"}
        color={tintColor}
        backgroundColor={"transparent"}
      ></Icon>
    )
  },
  showLabel: false,
}

const ListNavigator = createStackNavigator(
  ScreenDirectory,
  { initialRouteName: 'Lists'
  , defaultNavigationOptions: ({navigation}) => {
      return {
        header: header,
      }
    }
  }
)
ListNavigator.navigationOptions = {
  title: "Lists",
  tabBarIcon: ( { focused, horizontal, tintColor }) => {
    return (
      <Icon
        type={"list"}
        color={tintColor}
        backgroundColor={"transparent"}
      > 
      </Icon>
    )
  }
}

//const backgroundTabColor = "#444444";
const backgroundTabColor = TAB_GREY;

const AppNavigator = createBottomTabNavigator(
  {
    Dash: DashNavigator,
    Lists: ListNavigator
  },
  { tabBarOptions: {
      activeBackgroundColor: backgroundTabColor,
      inactiveBackgroundColor: backgroundTabColor,
      activeTintColor: "white",
      inactiveTintColor: "#848484",
      showLabel: false,
    }

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
