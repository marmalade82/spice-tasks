
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";

import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAll,
    createTasks,
} from "src/common/test-utils";
import MyDate from "src/common/Date";

import { RecurLogic } from "src/Models/Recurrence/RecurQuery";
import TaskQuery from "../Task/TaskQuery";
import { TaskParentTypes } from "../Task/Task";

describe("Recurring task recurs despite being very far in past", () => {
    beforeEach(async () => {
        await destroyAll();
    })

    afterEach(async () => {
        await destroyAll();
    })

    test("daily", async () => {
        await setup();

        await wait(async () => {
            const tasks = await new TaskQuery().all();
            expect(tasks.length).toEqual(18);
        })

        await RecurLogic.processRecurrences();

        await wait(async () => {
            const tasks = await new TaskQuery().all();
            expect(tasks.length).toEqual(21);
        })

        async function setup() {
            const opts = {
                taskId: "",
            }
            await DB.get().action(async () => {
                await createTasks({
                    parent: {
                        id: opts.taskId,
                        type: TaskParentTypes.NONE,
                    },
                    title: "Older",
                    active: true,
                    startDate: MyDate.Now().subtract(3, "days").toDate(),
                    dueDate: MyDate.Now().subtract(3, "days").add(30, "minutes").toDate(),
                    repeat: "daily",
                    lastRefresh: MyDate.Now().subtract(1, "days").toDate(),
                    nextRepeatCalculated: false,
                    
                }, 2)

                await createTasks({
                    parent: {
                        id: opts.taskId,
                        type: TaskParentTypes.NONE,
                    },
                    title: "Latest",
                    active: true,
                    startDate: MyDate.Now().subtract(2, "days").toDate(),
                    dueDate: MyDate.Now().subtract(2, "days").add(30, "minutes").toDate(),
                    repeat: "stop",
                    lastRefresh: MyDate.Now().subtract(1, "days").toDate(),
                    nextRepeatCalculated: false,
                }, 10)

                await createTasks({
                    parent: {
                        id: opts.taskId,
                        type: TaskParentTypes.NONE,
                    },
                    title: "Oldest",
                    active: true,
                    startDate: MyDate.Now().subtract(5, "days").toDate(),
                    dueDate: MyDate.Now().subtract(5, "days").add(30, "minutes").toDate(),
                    repeat: "daily",
                    lastRefresh: MyDate.Now().subtract(3, "days").toDate(),
                    nextRepeatCalculated: true,
                }, 5)

                await createTasks({
                    title: "Unrelated",
                    active: true,
                    startDate: MyDate.Now().subtract(2, "days").toDate(),
                    dueDate: MyDate.Now().subtract(2, "days").add(30, "minutes").toDate(),
                    repeat: "daily",
                    lastRefresh: MyDate.Now().subtract(3, "days").toDate(),
                    nextRepeatCalculated: false,
                }, 1)
            })
            return opts;
        }
    })

    test("weekly", async () => {
        await setup();

        await wait(async () => {
            const tasks = await new TaskQuery().all();
            expect(tasks.length).toEqual(18);
        })

        await RecurLogic.processRecurrences();

        await wait(async () => {
            const tasks = await new TaskQuery().all();
            expect(tasks.length).toEqual(21);
        })

        async function setup() {
            const opts = {
                taskId: "",
            }
            await DB.get().action(async () => {
                await createTasks({
                    parent: {
                        id: opts.taskId,
                        type: TaskParentTypes.NONE,
                    },
                    title: "Older",
                    active: true,
                    startDate: MyDate.Now().subtract(3, "weeks").toDate(),
                    dueDate: MyDate.Now().subtract(3, "weeks").add(30, "minutes").toDate(),
                    repeat: "weekly",
                    lastRefresh: MyDate.Now().subtract(1, "days").toDate(),
                    nextRepeatCalculated: false,
                    
                }, 2)

                await createTasks({
                    parent: {
                        id: opts.taskId,
                        type: TaskParentTypes.NONE,
                    },
                    title: "Latest",
                    active: true,
                    startDate: MyDate.Now().subtract(2, "weeks").toDate(),
                    dueDate: MyDate.Now().subtract(2, "weeks").add(30, "minutes").toDate(),
                    repeat: "stop",
                    lastRefresh: MyDate.Now().subtract(1, "days").toDate(),
                    nextRepeatCalculated: false,
                }, 10)

                await createTasks({
                    parent: {
                        id: opts.taskId,
                        type: TaskParentTypes.NONE,
                    },
                    title: "Oldest",
                    active: true,
                    startDate: MyDate.Now().subtract(5, "weeks").toDate(),
                    dueDate: MyDate.Now().subtract(5, "weeks").add(30, "minutes").toDate(),
                    repeat: "weekly",
                    lastRefresh: MyDate.Now().subtract(3, "days").toDate(),
                    nextRepeatCalculated: true,
                }, 5)

                await createTasks({
                    title: "Unrelated",
                    active: true,
                    startDate: MyDate.Now().subtract(2, "weeks").toDate(),
                    dueDate: MyDate.Now().subtract(2, "weeks").add(30, "minutes").toDate(),
                    repeat: "weekly",
                    lastRefresh: MyDate.Now().subtract(3, "days").toDate(),
                    nextRepeatCalculated: false,
                }, 1)
            })
            return opts;
        }

    })

    test("monthly", async () => {
        await setup();

        await wait(async () => {
            const tasks = await new TaskQuery().all();
            expect(tasks.length).toEqual(18);
        })

        await RecurLogic.processRecurrences();

        await wait(async () => {
            const tasks = await new TaskQuery().all();
            expect(tasks.length).toEqual(21);
        })

        async function setup() {
            const opts = {
                taskId: "",
            }
            await DB.get().action(async () => {
                await createTasks({
                    parent: {
                        id: opts.taskId,
                        type: TaskParentTypes.NONE,
                    },
                    title: "Older",
                    active: true,
                    startDate: MyDate.Now().subtract(3, "months").toDate(),
                    dueDate: MyDate.Now().subtract(3, "months").add(30, "minutes").toDate(),
                    repeat: "monthly",
                    lastRefresh: MyDate.Now().subtract(1, "days").toDate(),
                    nextRepeatCalculated: false,
                    
                }, 2)

                await createTasks({
                    parent: {
                        id: opts.taskId,
                        type: TaskParentTypes.NONE,
                    },
                    title: "Latest",
                    active: true,
                    startDate: MyDate.Now().subtract(2, "months").toDate(),
                    dueDate: MyDate.Now().subtract(2, "months").add(30, "minutes").toDate(),
                    repeat: "stop",
                    lastRefresh: MyDate.Now().subtract(1, "days").toDate(),
                    nextRepeatCalculated: false,
                }, 10)

                await createTasks({
                    parent: {
                        id: opts.taskId,
                        type: TaskParentTypes.NONE,
                    },
                    title: "Oldest",
                    active: true,
                    startDate: MyDate.Now().subtract(5, "months").toDate(),
                    dueDate: MyDate.Now().subtract(5, "months").add(30, "minutes").toDate(),
                    repeat: "monthly",
                    lastRefresh: MyDate.Now().subtract(3, "days").toDate(),
                    nextRepeatCalculated: true,
                }, 5)

                await createTasks({
                    title: "Unrelated",
                    active: true,
                    startDate: MyDate.Now().subtract(2, "months").toDate(),
                    dueDate: MyDate.Now().subtract(2, "months").add(30, "minutes").toDate(),
                    repeat: "monthly",
                    lastRefresh: MyDate.Now().subtract(3, "days").toDate(),
                    nextRepeatCalculated: false,
                }, 1)
            })
            return opts;
        }
    })

});
