
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
import AppStartScreen from "./AppStartScreen";


describe("Viewing data", () => {
    afterEach(async () => {
        await destroyAll();
    })

    test("User can view tasks that are due today", async () => {
        await setup();

        const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
            <AppStartScreen navigation={makeNavigation({})}></AppStartScreen>
        );

        await wait(async () => {
            const tasks = queryAllByLabelText("task-list-item");
            expect(tasks.length).toEqual(3);
        })

        async function setup() {
            await DB.get().action(async () => {
                await createTasks({
                    active: true,
                    dueDate: MyDate.Now().toDate(),
                }, 1)
                await createTasks({
                    active: true,
                    dueDate: MyDate.Now().prevMidnight().toDate(),
                }, 1)
                await createTasks({
                    active: true,
                    dueDate: MyDate.Now().nextMidnight().subtract(1, "minutes").toDate(),
                }, 1)
            });
        }
    })

    test("User can view tasks that are overdue", async () => {
        await setup();

        const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
            <AppStartScreen navigation={makeNavigation({})}></AppStartScreen>
        );

        await wait(async () => {
            const tasks = queryAllByLabelText("task-list-item");
            expect(tasks.length).toEqual(3);
        })

        async function setup() {
            await DB.get().action(async () => {
                await createTasks({
                    active: true,
                    dueDate: MyDate.Now().subtract(1, "days").toDate(),
                }, 1)
                await createTasks({
                    active: true,
                    dueDate: MyDate.Now().subtract(1, "days").prevMidnight().toDate(),
                }, 1)
                await createTasks({
                    active: true,
                    dueDate: MyDate.Now().subtract(1, "days").nextMidnight().subtract(1, "minutes").toDate(),
                }, 1)
            });
        }
    })

});


describe("Using lists", () => {
    afterEach(async () => {
        await destroyAll();
    })



    test("Can complete a task", async () => {
        const { id } = await setup();

        const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
            <AppStartScreen navigation={makeNavigation({})}></AppStartScreen>
        );

        let completeButton;
        await wait(async () => {
            completeButton = getByLabelText( "input-complete-" + id);
            fireEvent.press(completeButton)
        })

        await wait(async () => {
            const tasks = queryAllByLabelText("task-list-item");
            expect(tasks.length).toEqual(2);
        })

        async function setup() {
            const opts = {
                id: "",
            }
            await DB.get().action(async () => {
                opts.id = (await createTasks({
                    active: true,
                    dueDate: MyDate.Now().subtract(1, "days").toDate(),
                }, 1))[0].id;
                await createTasks({
                    active: true,
                    dueDate: MyDate.Now().subtract(1, "days").prevMidnight().toDate(),
                }, 1)
                await createTasks({
                    active: true,
                    dueDate: MyDate.Now().subtract(1, "days").nextMidnight().subtract(1, "minutes").toDate(),
                }, 1)
            });

            return opts;
        }
    }, 10000);

    test("Can fail a task", async () => {
        const { id } = await setup();

        const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
            <AppStartScreen navigation={makeNavigation({})}></AppStartScreen>
        );

        let failButton;
        await wait(async () => {
            failButton = getByLabelText( "input-fail-" + id);
            fireEvent.press(failButton)
        })

        await wait(async () => {
            const tasks = queryAllByLabelText("task-list-item");
            expect(tasks.length).toEqual(2);
        })

        async function setup() {
            const opts = {
                id: "",
            }
            await DB.get().action(async () => {
                opts.id = (await createTasks({
                    active: true,
                    dueDate: MyDate.Now().subtract(1, "days").toDate(),
                }, 1))[0].id;
                await createTasks({
                    active: true,
                    dueDate: MyDate.Now().subtract(1, "days").prevMidnight().toDate(),
                }, 1)
                await createTasks({
                    active: true,
                    dueDate: MyDate.Now().subtract(1, "days").nextMidnight().subtract(1, "minutes").toDate(),
                }, 1)
            });

            return opts;
        }
    }, 10000);

})