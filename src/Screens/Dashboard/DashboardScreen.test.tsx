
jest.mock("src/Models/Database");
import React from "react";
import DB from "src/Models/Database";
import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAllIn,
    createGoals, createTasks,
} from "src/common/test-utils";

import MyDate from "src/common/Date";

import DashboardScreen from "src/Screens/Dashboard/DashboardScreen";
import TaskQuery from "src/Models/Task/TaskQuery";

test("Initially user can see all active tasks due today", async () => {
    await setup();

    const { queryAllByLabelText } = render(
        <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
    );

    {
        await wait(() => {
            const dueTasks = queryAllByLabelText("task-list-item");
            expect(dueTasks.length).toEqual(4)
        });
    }



    await teardown();

    // TIME TO USE DEBUGGER FOR THESE TESTS! OR JUST IN THE BROWSER, SINCE THIS IS HAPPENING THERE TOO

    async function setup() {
        await DB.get().action(async () => {
            await createTasks({
                active: true,
                dueDate: new MyDate().toDate(),
                state: "in_progress",
            }, 3)

            await createTasks({
                active: true,
                dueDate: new MyDate().add(1, "hours").toDate(),
                state: "in_progress"
            }, 1)

            await createTasks({
                active: false,
                dueDate: new MyDate().toDate(),
                state: "in_progress",
            }, 2)
        });
    }

    async function teardown() {
        await destroyAllIn('tasks');
    }

})

test("Initially user can see all active overdue tasks", async () => {
    await setup();

    const { queryAllByLabelText } = render(
        <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
    );

    {
        await wait(() => {
            const overdueTasks = queryAllByLabelText("task-list-item");
            expect(overdueTasks.length).toEqual(4)
        });
    }



    await teardown();

    async function setup() {
        await DB.get().action(async () => {
            await createTasks({
                active: true,
                dueDate: new MyDate().subtract(1, "days").toDate(),
                state: "in_progress",
            }, 3)

            await createTasks({
                active: true,
                dueDate: new MyDate().subtract(2, "days").toDate(),
                state: "in_progress",
            }, 1)

            await createTasks({
                active: false,
                dueDate: new MyDate().subtract(1, "days").toDate(),
                state: "in_progress",
            }, 2)
        });
    }

    async function teardown() {
        await destroyAllIn('tasks');
    }
});