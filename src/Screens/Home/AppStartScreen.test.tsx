
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
                    dueDate: new MyDate().toDate(),
                }, 1)
                await createTasks({
                    active: true,
                    dueDate: new MyDate().prevMidnight().toDate(),
                }, 1)
                await createTasks({
                    active: true,
                    dueDate: new MyDate().nextMidnight().subtract(1, "minutes").toDate(),
                }, 1)
            });
        }
    })

    test("User can view tasks that are in progress", async () => {
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
                    startDate: new MyDate().prevMidnight().toDate(),
                    dueDate: new MyDate().add(1, "days").toDate(),
                }, 1)
                await createTasks({
                    active: true,
                    startDate: new MyDate().prevMidnight().toDate(),
                    dueDate: new MyDate().add(1, "days").prevMidnight().toDate(),
                }, 1)
                await createTasks({
                    active: true,
                    startDate: new MyDate().prevMidnight().toDate(),
                    dueDate: new MyDate().add(1, "days").nextMidnight().subtract(1, "minutes").toDate(),
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
                    dueDate: new MyDate().subtract(1, "days").toDate(),
                }, 1)
                await createTasks({
                    active: true,
                    dueDate: new MyDate().subtract(1, "days").prevMidnight().toDate(),
                }, 1)
                await createTasks({
                    active: true,
                    dueDate: new MyDate().subtract(1, "days").nextMidnight().subtract(1, "minutes").toDate(),
                }, 1)
            });
        }
    })

    test("User can view ongoing goals", async () => {
        await setup();

        const { getByLabelText, queryByLabelText, queryAllByLabelText } = render(
            <AppStartScreen navigation={makeNavigation({})}></AppStartScreen>
        );

        await wait(async () => {
            const goals = queryAllByLabelText("goal-list-item");
            expect(goals.length).toEqual(3);
        })

        async function setup() {
            await DB.get().action(async () => {
                await createGoals({
                    active: true,
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().toDate(),
                }, 1)
                await createGoals({
                    active: true,
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().add(1, "days").toDate(),
                }, 1)
                await createGoals({
                    active: true,
                    startDate: new MyDate().subtract(2, "days").toDate(),
                    dueDate: new MyDate().subtract(1, "days").toDate(),
                }, 1)
            });
        }
    })
});
