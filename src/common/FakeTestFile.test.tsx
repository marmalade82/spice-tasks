
jest.mock("src/Notification");

jest
  .mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
  .mock('react-native-gesture-handler', () => {
    const View = require('react-native').View;
    return {
      State: {},
      PanGestureHandler: View,
      BaseButton: View,
      Directions: {},
    };
  })
  .mock('react-native-reanimated', () => {
    const View = require('react-native').View;

    const Easing = {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
      poly: jest.fn(),
      sin: jest.fn(),
      circle: jest.fn(),
      exp: jest.fn(),
      elastic: jest.fn(),
      back: jest.fn(),
      bounce: jest.fn(),
      bezier: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(),
    };

    return {
      Easing,
      Value: jest.fn(),
      event: jest.fn(),
      add: jest.fn(),
      eq: jest.fn(),
      set: jest.fn(),
      cond: jest.fn(),
      interpolate: jest.fn(),
      View: View,
      Extrapolate: { CLAMP: jest.fn() },
      Transition: {
        Together: 'Together',
        Out: 'Out',
        In: 'In',
      },
    };
  });

import { render } from '@testing-library/react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";
import React from "react";
import { ScreenDirectory } from './NavigatorScreens';

export function renderWithNavigation( initialRouteName: string, screens: object, navigatorConfig = {} ) {
    const AppNavigator = createStackNavigator(
      {
        ...screens,
      },
      { initialRouteName: initialRouteName, 
      ...navigatorConfig },
    );
  
    const App = createAppContainer(AppNavigator);
  
    return { ...render(<App />), navigationContainer: App };
}

test("Fake test", () => {
  renderWithNavigation("AppStart", ScreenDirectory);

} );