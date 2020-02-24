
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";

import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAll,
    createGoals, createTasks, createClaimedRewards,
    createRecurrences,
} from "src/common/test-utils";
import MyDate from "src/common/Date";

import GoalQuery, { GoalLogic } from "../Goal/GoalQuery";
import { GoalType } from "./GoalLogic";
import TaskQuery from "../Task/TaskQuery";

describe("streak tasks recur despite being very far in past" , () => {
    beforeEach(async() => {
        await destroyAll();
    });

    afterEach(async () => {
        await destroyAll();
    })

    test("daily", async () => {
        const { goalId } = await setup();
        await wait(async () => {
            const tasks = await new TaskQuery().hasParent(goalId);
            expect(tasks.length).toBe(4);
        })

        await new GoalLogic(goalId).generateNextStreakTasks();

        await wait(async () => {
            const tasks = await new TaskQuery().hasParent(goalId);
            expect(tasks.length).toBe(4 + 2 * 4);
        });

        async function setup() {
            const opts = {
                goalId: "",
            }


            await DB.get().action(async () => {
                const goals = await createGoals({
                    title: "streak",
                    active: true,
                    streakMinimum: 3,
                    goalType: GoalType.STREAK,
                    streakType: "daily",
                    latestCycleStartDate: new MyDate().subtract(4, "days").toDate(),
                }, 1)

                opts.goalId = goals[0].id;

                await createTasks({
                    title: "middle", 
                    active: false,
                    startDate: new MyDate().subtract(6, "days").toDate(),
                    parentId: opts.goalId,
                }, 1)

                await createTasks({
                    title: "latest", 
                    active: false,
                    startDate: new MyDate().subtract(4, "days").toDate(),
                    parentId: opts.goalId,
                }, 2)

                await createTasks({
                    title: "oldest", 
                    active: false,
                    startDate: new MyDate().subtract(7, "days").toDate(),
                    parentId: opts.goalId,
                }, 1)
            })

            return opts;
        }
    })

    test("weekly", async () => {
        const { goalId } = await setup();
        await wait(async () => {
            const tasks = await new TaskQuery().hasParent(goalId);
            expect(tasks.length).toBe(4);
        })

        await new GoalLogic(goalId).generateNextStreakTasks();

        await wait(async () => {
            const tasks = await new TaskQuery().hasParent(goalId);
            expect(tasks.length).toBe(4 + 2 * 4);
        });

        async function setup() {
            const opts = {
                goalId: "",
            }


            await DB.get().action(async () => {
                const goals = await createGoals({
                    title: "streak",
                    active: true,
                    streakMinimum: 3,
                    goalType: GoalType.STREAK,
                    streakType: "weekly",
                    latestCycleStartDate: new MyDate().subtract(4, "weeks").toDate(),
                }, 1)

                opts.goalId = goals[0].id;

                await createTasks({
                    title: "middle", 
                    active: false,
                    startDate: new MyDate().subtract(6, "weeks").toDate(),
                    parentId: opts.goalId,
                }, 1)

                await createTasks({
                    title: "latest", 
                    active: false,
                    startDate: new MyDate().subtract(4, "weeks").toDate(),
                    parentId: opts.goalId,
                }, 2)

                await createTasks({
                    title: "oldest", 
                    active: false,
                    startDate: new MyDate().subtract(7, "weeks").toDate(),
                    parentId: opts.goalId,
                }, 1)
            })

            return opts;
        }
    })

    test("monthly", async () => {
        const { goalId } = await setup();
        await wait(async () => {
            const tasks = await new TaskQuery().hasParent(goalId);
            expect(tasks.length).toBe(4);
        })

        await new GoalLogic(goalId).generateNextStreakTasks();

        await wait(async () => {
            const tasks = await new TaskQuery().hasParent(goalId);
            expect(tasks.length).toBe(4 + 2 * 4);
        });

        async function setup() {
            const opts = {
                goalId: "",
            }


            await DB.get().action(async () => {
                const goals = await createGoals({
                    title: "streak",
                    active: true,
                    streakMinimum: 3,
                    goalType: GoalType.STREAK,
                    streakType: "monthly",
                    latestCycleStartDate: new MyDate().subtract(4, "months").toDate(),
                }, 1)

                opts.goalId = goals[0].id;

                await createTasks({
                    title: "middle", 
                    active: false,
                    startDate: new MyDate().subtract(6, "months").toDate(),
                    parentId: opts.goalId,
                }, 1)

                await createTasks({
                    title: "latest", 
                    active: false,
                    startDate: new MyDate().subtract(4, "months").toDate(),
                    parentId: opts.goalId,
                }, 2)

                await createTasks({
                    title: "oldest", 
                    active: false,
                    startDate: new MyDate().subtract(7, "months").toDate(),
                    parentId: opts.goalId,
                }, 1)
            })

            return opts;
        }
    })
})