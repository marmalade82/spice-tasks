
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