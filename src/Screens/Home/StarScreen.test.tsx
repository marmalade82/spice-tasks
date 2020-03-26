
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
} from "src/common/test-utils";
import MyDate from "src/common/Date";
import StarScreen from "src/Screens/Home/StarScreen";

afterEach(async () => {
    await destroyAll();
})

test("User can view ongoing goals", async () => {
    await setup();

    const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
        <StarScreen navigation={makeNavigation({})}></StarScreen>
    );

    await wait(async () => {
        const goals = queryAllByLabelText("goal-list-item");
        expect(goals.length).toEqual(3);
    })

    async function setup() {
        await DB.get().action(async () => {
            await createGoals({
                active: true,
                startDate: MyDate.Now().subtract(1, "days").toDate(),
                dueDate: MyDate.Now().toDate(),
            }, 1)
            await createGoals({
                active: true,
                startDate: MyDate.Now().subtract(1, "days").toDate(),
                dueDate: MyDate.Now().add(1, "days").toDate(),
            }, 1)
            await createGoals({
                active: true,
                startDate: MyDate.Now().subtract(2, "days").toDate(),
                dueDate: MyDate.Now().subtract(1, "days").toDate(),
            }, 1)
        });
    }
})

test("Can complete a goal", async () => {
    const { id } = await setup();

    const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
        <StarScreen navigation={makeNavigation({})}></StarScreen>
    );

    let completeButton;
    await wait(async () => {
        completeButton = getByLabelText( "input-complete-" + id);
        fireEvent.press(completeButton)
    })

    await wait(async () => {
        const tasks = queryAllByLabelText("goal-list-item");
        expect(tasks.length).toEqual(2);
    })

    async function setup() {
        const opts = { id: "" }
        await DB.get().action(async () => {
            opts.id = (await createGoals({
                active: true,
                startDate: MyDate.Now().subtract(1, "days").toDate(),
                dueDate: MyDate.Now().toDate(),
            }, 1))[0].id
            await createGoals({
                active: true,
                startDate: MyDate.Now().subtract(1, "days").toDate(),
                dueDate: MyDate.Now().add(1, "days").toDate(),
            }, 1)
            await createGoals({
                active: true,
                startDate: MyDate.Now().subtract(2, "days").toDate(),
                dueDate: MyDate.Now().subtract(1, "days").toDate(),
            }, 1)
        });
        return opts;
    }
}, 10000);

test("Can fail a goal", async () => {
    const { id } = await setup();

    const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
        <StarScreen navigation={makeNavigation({})}></StarScreen>
    );

    let failButton;
    await wait(async () => {
        failButton = getByLabelText( "input-fail-" + id);
        fireEvent.press(failButton)
    })

    await wait(async () => {
        const tasks = queryAllByLabelText("goal-list-item");
        expect(tasks.length).toEqual(2);
    })

    async function setup() {
        const opts = { id: "" }
        await DB.get().action(async () => {
            opts.id = (await createGoals({
                active: true,
                startDate: MyDate.Now().subtract(1, "days").toDate(),
                dueDate: MyDate.Now().toDate(),
            }, 1))[0].id
            await createGoals({
                active: true,
                startDate: MyDate.Now().subtract(1, "days").toDate(),
                dueDate: MyDate.Now().add(1, "days").toDate(),
            }, 1)
            await createGoals({
                active: true,
                startDate: MyDate.Now().subtract(2, "days").toDate(),
                dueDate: MyDate.Now().subtract(1, "days").toDate(),
            }, 1)
        });
        return opts;
    }
}, 10000);