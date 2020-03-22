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
import ActiveTransaction from 'src/Models/common/Transaction';
import { countOfThings } from 'src/Screens/Prototypes/TestScreen';
import { ScreenParams } from 'src/common/Navigator';
import { ScreenDirectory } from "src/common/NavigatorScreens";



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

const GoalNavigator = createStackNavigator(
  ScreenDirectory,
  { initialRouteName: "Star"
  , defaultNavigationOptions: ({navigation}) => {
      return {
        header: header,
      }
    }
  }
)
GoalNavigator.navigationOptions = {
  title: "Lists",
  tabBarIcon: ( { focused, horizontal, tintColor }) => {
    return (
      <Icon
        type={"reward"}
        color={tintColor}
        backgroundColor={"transparent"}
      > 
      </Icon>
    )
  }
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
    Star: GoalNavigator,
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
        ActiveTransaction.invalidate()
        SpiceDBService.startService();
      } break;
      case "inactive": {
        ActiveTransaction.invalidate()
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
