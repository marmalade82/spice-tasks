
jest.mock("src/Models/Database");
jest.mock("src/Notification")
import DB from "src/Models/Database";
import Notification from "src/Notification";

import { 
    makeNavigation, destroyAll,
    createGoals, createTasks,
    createGlobal,
} from "src/common/test-utils";
import MyDate from "src/common/Date";
import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';

import GoalQuery, { GoalLogic } from "src/Models/Goal/GoalQuery";
import TaskQuery from "src/Models/Task/TaskQuery";
import GlobalQuery, { GlobalLogic } from "src/Models/Global/GlobalQuery";

beforeEach(async () => {
    jest.clearAllMocks();
})

afterEach(async () => {
    await destroyAll()
})

test("a notification is generated for overdue goals/tasks", async () => {
    await setup();

    await new GlobalLogic().runDailyNotifications();

    await wait(async () => {
        const global = await new GlobalQuery().current();
        expect( new MyDate(global.lastNotifiedDate).isSomeTimeToday() ).toEqual(true);

        expect(Notification.localNotification.mock.calls[0][0].toString().includes("3"))
    })

    async function setup() {
        await DB.get().action(async () => {
            await createGlobal({
                lastNotifiedDate: MyDate.Now().subtract(5, "days").toDate()
            })

            await createGoals({
                dueDate: MyDate.Now().subtract(1, "days").toDate()
            }, 1)

            await createTasks({
                dueDate: MyDate.Now().subtract(3, "days").toDate()
            }, 2)

        } )
    }
}, 10000)

test("a notification is generated for tasks due sometime today", async () => {
    await setup();

    await new GlobalLogic().runDailyNotifications();

    await wait(async () => {
        const global = await new GlobalQuery().current();
        expect( new MyDate(global.lastNotifiedDate).isSomeTimeToday() ).toEqual(true);

        expect(Notification.localNotification.mock.calls[0][0].toString().includes("4"))
    })

    async function setup() {
        await DB.get().action(async () => {
            await createGlobal({
                lastNotifiedDate: MyDate.Now().subtract(5, "days").toDate()
            })

            await createGoals({
                dueDate: MyDate.Now().toDate()
            }, 1)

            await createTasks({
                dueDate: MyDate.Now().toDate()
            }, 3)

        } )
    }
}, 10000)

test("a notification is not generated if it has already been generated today", async () => {

    await setup();

    await new GlobalLogic().runDailyNotifications();

    await wait(async () => {
        const global = await new GlobalQuery().current();
        expect( new MyDate(global.lastNotifiedDate).isSomeTimeToday() ).toEqual(true);

        expect(Notification.localNotification.mock.calls[0]).toEqual(undefined);
    })

    async function setup() {
        await DB.get().action(async () => {
            await createGlobal({
                lastNotifiedDate: MyDate.Now().toDate()
            })

            await createGoals({
                dueDate: MyDate.Now().toDate()
            }, 1)

            await createTasks({
                dueDate: MyDate.Now().toDate()
            }, 3)

        } )
    }
})