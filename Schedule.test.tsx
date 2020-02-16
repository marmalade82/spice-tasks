
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";
import App from "App";
import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAllIn,
    createGoals, createTasks, destroyAll,
} from "src/common/test-utils";
import MyDate from "src/common/Date";
import { Schedule } from "./Schedule";
import TaskQuery from "src/Models/Task/TaskQuery";
import { GoalType } from "src/Models/Goal/GoalLogic";

test("Daily streak goal regenerates tasks", async () => {
    jest.useFakeTimers();
    const { id } = await setup();

    await wait(async () => {
        const tasks = await new TaskQuery().queryActiveHasParent(id).fetch();
        expect(tasks.length).toEqual(2)
    })

    await Schedule.refreshStreakGoals(1, () => false );
    
    
    await wait(async () => {
        const tasks = await new TaskQuery().queryActiveHasParent(id).fetch();
        expect(tasks.length).toEqual(4) // 2 * 2
    })

    jest.runOnlyPendingTimers();

    await wait(async () => {
        const tasks = await new TaskQuery().queryActiveHasParent(id).fetch();
        expect(tasks.length).toEqual(8) // 2 * 2 * 2
    })

    jest.runOnlyPendingTimers();

    await wait(async () => {
        const tasks = await new TaskQuery().queryActiveHasParent(id).fetch();
        expect(tasks.length).toEqual(16) // 2 * 2 * 2 * 2
    })

    await teardown();

    async function setup() {
        const opts = {
            id: ""
        }
        await DB.get().action(async() => {
            const goal = (await createGoals({
                title: "Goal",
                active: true,
                state: "open",
                goalType: GoalType.STREAK,
                streakType: "daily",
                // starts 30 minutes from now
                streakDailyStart: new MyDate().add(30, "minutes").toDate(),
                startDate: new MyDate().subtract(2, "days").toDate(),
                dueDate: new MyDate().add(2, "days").toDate(),
            }, 1))[0]

            opts.id = goal.id;

            const childrenTasks = await createTasks({
                // children were created quite a bit in the past, so they should be regenerated.
                title: "Child",
                parentId: goal.id,
                active: true,
                state: "open",
                startDate: new MyDate().toDate(),
                dueDate: new MyDate().toDate(),
                createdAt: new MyDate().subtract(5, "hours").toDate(),
            }, 2);
        })

        return opts
    }

    async function teardown() {
        await destroyAll();
    }
}, 20000);



test("Weekly streak goal regenerates tasks", async () => {
    jest.useFakeTimers();
    const { id } = await setup();

    await wait(async () => {
        const tasks = await new TaskQuery().queryActiveHasParent(id).fetch();
        expect(tasks.length).toEqual(2)
    })

    await Schedule.refreshStreakGoals(1, () => false );
    
    
    await wait(async () => {
        const tasks = await new TaskQuery().queryActiveHasParent(id).fetch();
        expect(tasks.length).toEqual(4) // 2 * 2
    })

    jest.runOnlyPendingTimers();

    await wait(async () => {
        const tasks = await new TaskQuery().queryActiveHasParent(id).fetch();
        expect(tasks.length).toEqual(8) // 2 * 2 * 2
    })

    jest.runOnlyPendingTimers();

    await wait(async () => {
        const tasks = await new TaskQuery().queryActiveHasParent(id).fetch();
        expect(tasks.length).toEqual(16) // 2 * 2 * 2 * 2
    })

    await teardown();

    async function setup() {
        const opts = {
            id: ""
        }
        await DB.get().action(async() => {
            const goal = (await createGoals({
                title: "Goal",
                active: true,
                state: "open",
                goalType: GoalType.STREAK,
                streakType: "weekly",
                // starts 30 minutes from now
                streakWeeklyStart: new MyDate().add(1, "days").dayName(), // regenerates tomorrow at midnight.
                startDate: new MyDate().subtract(3, "days").toDate(),
                dueDate: new MyDate().add(3, "days").toDate(),
            }, 1))[0]

            opts.id = goal.id;

            const childrenTasks = await createTasks({
                // children were created quite a bit in the past, so they should be regenerated.
                title: "Child",
                parentId: goal.id,
                active: true,
                state: "open",
                startDate: new MyDate().toDate(),
                dueDate: new MyDate().toDate(),
                createdAt: new MyDate().subtract(5, "hours").toDate(),
            }, 2);
        })

        return opts
    }

    async function teardown() {
        await destroyAll();
    }
}, 20000);


test("Monthly streak goal regenerates tasks", async () => {
    expect(true).toBe(false);
    jest.useFakeTimers();
    const { id } = await setup();

    await wait(async () => {
        const tasks = await new TaskQuery().queryActiveHasParent(id).fetch();
        expect(tasks.length).toEqual(2)
    })

    await Schedule.refreshStreakGoals(1, () => false );
    
    
    await wait(async () => {
        const tasks = await new TaskQuery().queryActiveHasParent(id).fetch();
        expect(tasks.length).toEqual(4) // 2 * 2
    })

    jest.runOnlyPendingTimers();

    await wait(async () => {
        const tasks = await new TaskQuery().queryActiveHasParent(id).fetch();
        expect(tasks.length).toEqual(8) // 2 * 2 * 2
    })

    jest.runOnlyPendingTimers();

    await wait(async () => {
        const tasks = await new TaskQuery().queryActiveHasParent(id).fetch();
        expect(tasks.length).toEqual(16) // 2 * 2 * 2 * 2
    })

    await teardown();

    async function setup() {
        const opts = {
            id: ""
        }
        await DB.get().action(async() => {
            const goal = (await createGoals({
                title: "Goal",
                active: true,
                state: "open",
                goalType: GoalType.STREAK,
                streakType: "daily",
                // starts 30 minutes from now
                streakDailyStart: new MyDate().add(30, "minutes").toDate(),
                startDate: new MyDate().subtract(2, "days").toDate(),
                dueDate: new MyDate().add(2, "days").toDate(),
            }, 1))[0]

            opts.id = goal.id;

            const childrenTasks = await createTasks({
                // children were created quite a bit in the past, so they should be regenerated.
                title: "Child",
                parentId: goal.id,
                active: true,
                state: "open",
                startDate: new MyDate().toDate(),
                dueDate: new MyDate().toDate(),
                createdAt: new MyDate().subtract(5, "hours").toDate(),
            }, 2);
        })

        return opts
    }

    async function teardown() {
        await destroyAll();
    }
}, 20000);