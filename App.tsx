import React from 'react';
import * as Screens from "src/Screens";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, HeaderBackButton, HeaderProps } from 'react-navigation-stack';
import { createDrawerNavigator } from "react-navigation-drawer";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Button, AppState } from "react-native";
import { Schedule } from "./Schedule";
import SpiceDBService from 'src/Services/DBService';
import Default from 'src/Components/Styled/Styles';
import { IconButton, Icon, ScreenHeader } from 'src/Components/Styled/Styled';
import ActiveTransaction from 'src/Models/common/Transaction';
import { ScreenDirectory } from "src/common/NavigatorScreens";
import { CommonType, CustomType, ClassType,
    makeCommon, makeCustom, makeClass, StyleSheetContext,
 } from 'src/Components/Styled/StyleSheets';
import GlobalQuery from 'src/Models/Global/GlobalQuery';
import Global from 'src/Models/Global/Global';



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

const ReportNavigator = createStackNavigator(
  ScreenDirectory,
  { initialRouteName: 'Reports'
  , defaultNavigationOptions: ({navigation}) => {
      return {
        header: header
      }
    }
  }
)
ReportNavigator.navigationOptions = {
  title: "Reports",
  tabBarIcon: ( { focused, horizontal, tintColor }) => {
    return (
      <Icon
        type={"reports"}
        color={tintColor}
        backgroundColor={"transparent"}
      > 
      </Icon>
    )
  }
}

const backgroundTabColor = Default.TAB_GREY;

const AppNavigator = createBottomTabNavigator(
  {
    Dash: DashNavigator,
    Star: GoalNavigator,
    Reports: ReportNavigator,
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

interface Props {}
interface State {
  StyleSheetContext: {
    Common: CommonType,
    Custom: CustomType,
    Class: ClassType,
  },
  global: Global | undefined;
}

export default class App extends React.Component<Props, State> {
  unsub: () => void;
  theme: typeof Default;
  constructor(props: Props) {
    super(props);

    this.theme = Object.assign({}, Default);

    this.state = {
      StyleSheetContext: {
        Common: makeCommon(this.theme),
        Custom: makeCustom(this.theme),
        Class: makeClass(this.theme),
      },
      global: undefined
    }
    this.unsub = () => {}
  }

  componentDidMount = () => {
    AppState.addEventListener('change', this.handleAppStateChange);
    
    void Schedule.refresh(1, () => false);
    void Schedule.reminders(1, () => false);

    void new GlobalQuery().current().then((global) => {
      this.setState({
        global: global,
      })

      let themeSub = global.observe().subscribe((global) => {
        this.theme.PRIMARY_COLOR = global.primaryColor;
        this.theme.SECONDARY_COLOR = global.secondaryColor;
        this.theme.PRIMARY_COLOR_LIGHT = global.primaryLightColor;
        this.setState({
          StyleSheetContext: {
            Common: makeCommon(this.theme),
            Custom: makeCustom(this.theme),
            Class: makeClass(this.theme),
          }
        })
      })
      
      const unsub = this.unsub;
      this.unsub = () => {
        themeSub.unsubscribe();
        unsub();
      }
    })
  }

  componentWillUnmount = () => {
    AppState.removeEventListener('change', this.handleAppStateChange)
    this.unsub();
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
    return (
      <StyleSheetContext.Provider value={this.state.StyleSheetContext}>
        <AppContainer></AppContainer>
      </StyleSheetContext.Provider>
    )
  }
}
