
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";

import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAll,
    createGoals, createTasks, createClaimedRewards,
    createRecurrences, createStreakCycles,
} from "src/common/test-utils";
import MyDate from "src/common/Date";

import GoalQuery, { GoalLogic } from "../Goal/GoalQuery";
import { GoalType } from "./GoalLogic";
import TaskQuery from "../Task/TaskQuery";
import { dueDate, startDate } from "src/Components/Forms/common/utils";
import StreakCycle from "../Group/StreakCycle";


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
            const tasks = await new TaskQuery().all();
            expect(tasks.length).toBe(4);
        })

        await new GoalLogic(goalId).generateNextStreakTasks();

        await wait(async () => {
            const tasks = await new TaskQuery().all();
            expect(tasks.length).toBe(4 + 2 * 4);
        });

        async function setup() {
            const opts = {
                goalId: "",
            }


            await DB.get().action(async () => {

                const goal = (await createGoals({
                    title: "streak",
                    active: true,
                    streakMinimum: 3,
                    goalType: GoalType.STREAK,
                    startDate: startDate(new MyDate().subtract(1, "months").toDate()),
                    dueDate: dueDate(new MyDate().add(1, "months").toDate()),
                    streakType: "daily",
                    latestCycleId: "",
                }, 1))[0];

                const cycle = (await createStreakCycles({
                    parentGoalId: goal.id,
                    startDate: startDate(new MyDate().subtract(4, "days").toDate()),
                    endDate: dueDate(new MyDate().subtract(4, "days").toDate()),
                }, 1))[0];

                opts.goalId = goal.id

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
                    parentId: cycle.id,
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
            const tasks = await new TaskQuery().all();
            expect(tasks.length).toBe(4);
        })

        await new GoalLogic(goalId).generateNextStreakTasks();

        await wait(async () => {
            const tasks = await new TaskQuery().all();
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
                    startDate: startDate(new MyDate().subtract(10, "weeks").toDate()),
                    dueDate: dueDate(new MyDate().add(10, "weeks").toDate()),
                    goalType: GoalType.STREAK,
                    streakType: "weekly",
                    latestCycleId: "",
                }, 1)

                opts.goalId = goals[0].id;

                const cycle = (await createStreakCycles({
                    parentGoalId: opts.goalId,
                    startDate: startDate(new MyDate().subtract(4, "weeks").toDate()),
                    endDate: dueDate(new MyDate().subtract(4, "weeks").toDate()),
                }, 1))[0];

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
                    parentId: cycle.id,
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
            const tasks = await new TaskQuery().all();
            expect(tasks.length).toBe(4);
        })

        await new GoalLogic(goalId).generateNextStreakTasks();

        await wait(async () => {
            const tasks = await new TaskQuery().all();
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
                    startDate: startDate(new MyDate().subtract(10, "months").toDate()),
                    dueDate: dueDate(new MyDate().add(10, "months").toDate()),
                    streakType: "monthly",
                    latestCycleId: "",
                }, 1)

                opts.goalId = goals[0].id;

                const cycle = (await createStreakCycles({
                    parentGoalId: opts.goalId,
                    startDate: startDate(new MyDate().subtract(4, "months").toDate()),
                    endDate: dueDate(new MyDate().subtract(4, "months").toDate()),
                }, 1))[0];

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
                    parentId: cycle.id,
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

describe("Processing partially processed streak goals", () => {
    beforeEach(async () => {
        await destroyAll();
    })

    afterEach(async () => {
        await destroyAll();
    });

    test("correct amount of processing occurs", async () => {
        await wait(async () => {
            const goals = await new GoalQuery().unprocessed();
            expect(goals.length).toEqual(0)
        });

        await setup();

        await wait(async () => {
            const goals = await new GoalQuery().unprocessed();
            expect(goals.length).toEqual(3)
        });

        await GoalLogic.processSomeStreaks(2);

        await wait(async () => {
            const goals = await new GoalQuery().unprocessed();
            expect(goals.length).toEqual(1)
        });

        await GoalLogic.processSomeStreaks(2);

        await wait(async () => {
            const goals = await new GoalQuery().unprocessed();
            expect(goals.length).toEqual(0)
        });

        async function setup() {
            const opts = {
                goal_1: "",
                goal_2: "",
                goal_3: "",
                goal_4: "",
                goal_5: "",
            }
            await DB.get().action(async () => {
                const goal_1 = await createGoals({
                    streakType: "daily",
                    goalType: GoalType.STREAK,
                    active: true,
                    lastRefreshed: new MyDate().subtract(1, "days").toDate(),
                }, 1)

                opts.goal_1 = goal_1[0].id;

                const goal_2 = await createGoals({
                    streakType: "weekly",
                    goalType: GoalType.STREAK,
                    active: true,
                    lastRefreshed: new MyDate().subtract(1, "days").toDate(),
                }, 1)

                opts.goal_2 = goal_2[0].id;

                const goal_3 = await createGoals({
                    streakType: "monthly",
                    goalType: GoalType.STREAK,
                    active: true,
                    lastRefreshed: new MyDate().subtract(2, "days").toDate(),
                }, 1)

                opts.goal_3 = goal_3[0].id;

                const goal_4 = await createGoals({
                    streakType: "daily",
                    goalType: GoalType.STREAK,
                    active: true,
                    lastRefreshed: new MyDate().toDate(),
                }, 1)

                opts.goal_4 = goal_4[0].id;

                const goal_5 = await createGoals({
                    streakType: "daily",
                    goalType: GoalType.STREAK,
                    active: false,
                    lastRefreshed: new MyDate().toDate(),
                }, 1)

                opts.goal_5 = goal_5[0].id;

            })
            return opts;
        }
    });
});

describe("streak tasks have proper values", () => {
    afterEach(async () => {
        await destroyAll();
    })

    test("generated tasks are active", async () => {
        await setup();

        await wait(async () => {
            const goals = await new GoalQuery().unprocessed();
            expect(goals.length).toEqual(1)
        });

        await wait(async () => {
            const tasks = await new TaskQuery().activeTasks();
            expect(tasks.length).toEqual(0);
        })

        await GoalLogic.processSomeStreaks(2);

        await wait(async () => {
            const goals = await new GoalQuery().unprocessed();
            expect(goals.length).toEqual(0)
        });

        await wait(async () => {
            const tasks = await new TaskQuery().activeTasks();
            expect(tasks.length).toEqual(1);
        })

        async function setup() {
            await DB.get().action(async () => {
                const goal_1 = (await createGoals({
                    streakType: "daily",
                    goalType: GoalType.STREAK,
                    active: true,
                    startDate: startDate(new MyDate().subtract(10, "days").toDate()),
                    dueDate: dueDate(new MyDate().add(10, "days").toDate()),
                    latestCycleId: "",
                    lastRefreshed: new MyDate().subtract(1, "days").toDate(),
                }, 1))[0];
                const cycle = (await createStreakCycles({
                    parentGoalId: goal_1.id,
                    startDate: startDate(new MyDate().subtract(1, "days").toDate()),
                    endDate: dueDate(new MyDate().subtract(1, "days").toDate()),
                }, 1))[0];
                await createTasks({
                    title: "latest", 
                    active: false,
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    parentId: cycle.id,
                }, 1)
            });

        }
    })
});
