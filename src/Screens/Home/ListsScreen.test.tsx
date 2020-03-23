
jest.mock("src/Models/Database");
jest.mock("src/Notification");
import Notification from "src/Notification";
import DB from "src/Models/Database";
import React from "react";

import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAll,
    createPenalties,
    createTasks,
    createGoals,
    createEarnedRewards,
    createEarnedPenalties,
} from "src/common/test-utils";
import MyDate from "src/common/Date";
import ListsScreen from "./ListsScreen";
import { renderWithNavigation } from "src/common/MockNavigation";
import { View, Button } from "react-native";

describe("viewing data", () => {
    afterEach(async () => {
        await destroyAll();
    })

    test("can view unused earned rewards", async () => {
        await setup();

        const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
            <ListsScreen navigation={makeNavigation({})}></ListsScreen>
        );

        await wait(async () => {
            const earned = queryAllByLabelText("earned-reward-list-item");
            expect(earned.length).toEqual(2);
        })

        async function setup() {
            await DB.get().action(async () => {
                await createEarnedRewards({
                    active: true,
                }, 2)
                await createEarnedRewards({
                    active: false,
                }, 1)
            })
        }
    }, 10000)

    test("can view unused earned penalties", async () => {
        await setup();

        const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
            <ListsScreen navigation={makeNavigation({})}></ListsScreen>
        );

        await wait(async () => {
            const earned = queryAllByLabelText("earned-penalty-list-item");
            expect(earned.length).toEqual(2);
        })

        async function setup() {
            await DB.get().action(async () => {
                await createEarnedPenalties({
                    active: true,
                }, 2)
                await createEarnedPenalties({
                    active: false,
                }, 1)
            })
        }
    }, 10000)
})

describe("using lists", () => {
    afterEach(async () => {
        await destroyAll();
    })

    test("can use a reward", async () => {
        const { id } = await setup();

        const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
            <ListsScreen navigation={makeNavigation({})}></ListsScreen>
        );

        let useButton;
        await wait(async () => {
            useButton = getByLabelText("input-use-" + id);
            fireEvent.press(useButton);
        })

        await wait(async () => {
            const earned = queryAllByLabelText("earned-reward-list-item");
            expect(earned.length).toEqual(1);
        })

        async function setup() {
            let opts = { id: "" }
            await DB.get().action(async () => {
                opts.id = (await createEarnedRewards({
                    active: true,
                }, 2))[0].id;
                await createEarnedRewards({
                    active: false,
                }, 1)
            })

            return opts;
        }
    }, 10000)

    test("can use a penalty", async () => {
        const { id } = await setup();

        const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
            <ListsScreen navigation={makeNavigation({})}></ListsScreen>
        );

        let useButton;
        await wait(async () => {
            useButton = getByLabelText("input-use-" + id);
            fireEvent.press(useButton);
        })

        await wait(async () => {
            const earned = queryAllByLabelText("earned-penalty-list-item");
            expect(earned.length).toEqual(1);
        })

        async function setup() {
            let opts = { id: "" }
            await DB.get().action(async () => {
                opts.id = (await createEarnedPenalties({
                    active: true,
                }, 2))[0].id;
                await createEarnedPenalties({
                    active: false,
                }, 1)
            })

            return opts;
        }
    }, 10000);
})

describe.only("Navigation", () => {
    test.only("Can navigate to list of all goals screen", async () => {
        const { getByLabelText, queryNavigation, navigation } = renderWithNavigation("Lists", {});
        expect(queryNavigation.currentRoute).toEqual("Lists");

        {
            const goalDest = getByLabelText("input-dest-goals")
            fireEvent.press(goalDest);
        }
        
        await wait(async () => {
            expect(queryNavigation.currentRoute).toEqual("Goals"); 
        });

        navigation.goBack();
        expect(queryNavigation.currentRoute).toEqual("Lists");

        {
            const goalDest = getByLabelText("input-dest-goals")
            fireEvent.press(goalDest);
        }
        
        await wait(async () => {
            expect(queryNavigation.currentRoute).toEqual("Goals"); 
        });

    }, 10000)
})