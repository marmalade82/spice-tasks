import { render } from "@testing-library/react-native";
import { ScreenParams } from "./Navigator";
import { ScreenDirectory } from "./NavigatorScreens";
import React from "react";

var chance = require("chance");
var Chance = new chance();

type NavigatorState<T extends keyof ScreenParams> = {
    state: {
        key: string;
    },
    params: ScreenParams[T],
    route: T,
    renderFns: any,
    /*renderFns: {
        getByLabelText: any,
        queryByLabelText: any,
        queryAllByLabelText: any,
        baseElement: any,
        container: any,
    }*/

}

interface Props {
    navigation: object;
}


export function renderWithNavigation<T extends keyof ScreenParams>(initialRoute: T, initialParams: ScreenParams[T]) {
    let directory = ScreenDirectory;
    let stack: NavigatorState<any>[] = [];
    let navigation = {
        push: function <T extends keyof ScreenParams>(route: T, params: ScreenParams[T]) {
            console.log("navigating to " + route);
            stack.push({
                state: {
                    key: Chance.guid(),
                },
                params: params,
                route: route,
                renderFns: undefined,
            })
            let Component: new (props: Props) => React.Component<Props, {}> = directory[route as string];
            const results = render(
                <Component navigation={navigation}></Component>
            )

            stack[stack.length - 1].renderFns = results;
        },
        navigate: function <T extends keyof ScreenParams>(screen: T, params: ScreenParams[T]) {
            let found = stack.find((navState) => {
                return navState.route === screen;
            })
            if(found) {
                // pop until the desired screen is on the top of the stack.
                while(stack.length > 1 && stack[stack.length - 1].route !== screen) {
                    stack[stack.length - 1].renderFns.unmount();
                    stack.pop();
                    stack[stack.length - 1].params = params;
                } 
            } else {
                this.push(screen, params);
            }
        },
        goBack: function (thing?: null) {
            if(stack.length > 1) {
                stack[stack.length - 1].renderFns.unmount();
                stack.pop();
            }
        },
        get state() {
            return stack[stack.length - 1].state;
        },
        getParam: function(param: string, fallback) {
            const p = (stack[stack.length - 1]).params[param];
            if(p === undefined) {
                return fallback;
            }

            return p;
        },
    }
    navigation.push(initialRoute, initialParams);

    let queryNavigation = {
        get currentRoute() {
            return stack[stack.length - 1].route as string;
        }
    }


    return {
        getByLabelText: (...args) => {
            return stack[stack.length - 1].renderFns.getByLabelText(...args)
        },
        queryByLabelText: (...args) => {
            return stack[stack.length - 1].renderFns.queryByLabelText(...args)
        },
        queryAllByLabelText: (...args) => {
            return stack[stack.length - 1].renderFns.queryAllByLabelText(...args)
        },
        queryNavigation: queryNavigation,
        navigation
    }

}