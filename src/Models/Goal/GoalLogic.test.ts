
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";

import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAll,
    createGoals, createTasks,
    createRecurrences, createStreakCycles,
} from "src/common/test-utils";
import MyDate from "src/common/Date";

import GoalQuery, { GoalLogic, ActiveGoalQuery, CompleteGoalQuery } from "../Goal/GoalQuery";
import { GoalType } from "./GoalLogic";
import TaskQuery, { ActiveTaskQuery, ChildTaskQuery } from "../Task/TaskQuery";
import { dueDate, startDate } from "src/Components/Forms/common/utils";
import StreakCycle from "../Group/StreakCycle";
import StreakCycleQuery, { ChildStreakCycleQuery } from "../Group/StreakCycleQuery";


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
            const cycles = await new StreakCycleQuery().all();
            expect(cycles.length).toBe(1);
        })

        await new GoalLogic(goalId).generateNextStreakTasks();

        await wait(async () => {
            const tasks = await new TaskQuery().all();
            expect(tasks.length).toBe(4 + 2 * 4);
            const cycles = await new StreakCycleQuery().all();
            expect(cycles.length).toBe(1 + 4);
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
                    startDate: startDate(MyDate.Now().subtract(1, "months").toDate()),
                    dueDate: dueDate(MyDate.Now().add(1, "months").toDate()),
                    streakType: "daily",
                    latestCycleId: "",
                }, 1))[0];

                const cycle = (await createStreakCycles({
                    parentGoalId: goal.id,
                    startDate: startDate(MyDate.Now().subtract(4, "days").toDate()),
                    endDate: dueDate(MyDate.Now().subtract(4, "days").toDate()),
                }, 1))[0];

                opts.goalId = goal.id

                await createTasks({
                    title: "middle", 
                    active: false,
                    startDate: MyDate.Now().subtract(6, "days").toDate(),
                    parentId: opts.goalId,
                }, 1)

                await createTasks({
                    title: "latest", 
                    active: false,
                    startDate: MyDate.Now().subtract(4, "days").toDate(),
                    parentId: cycle.id,
                }, 2)

                await createTasks({
                    title: "oldest", 
                    active: false,
                    startDate: MyDate.Now().subtract(7, "days").toDate(),
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
            const cycles = await new StreakCycleQuery().all();
            expect(cycles.length).toBe(1);
        })

        await new GoalLogic(goalId).generateNextStreakTasks();

        await wait(async () => {
            const tasks = await new TaskQuery().all();
            expect(tasks.length).toBe(4 + 2 * 4);
            const cycles = await new StreakCycleQuery().all();
            expect(cycles.length).toBe(1 + 4);
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
                    startDate: startDate(MyDate.Now().subtract(10, "weeks").toDate()),
                    dueDate: dueDate(MyDate.Now().add(10, "weeks").toDate()),
                    goalType: GoalType.STREAK,
                    streakType: "weekly",
                    latestCycleId: "",
                }, 1)

                opts.goalId = goals[0].id;

                const cycle = (await createStreakCycles({
                    parentGoalId: opts.goalId,
                    startDate: startDate(MyDate.Now().subtract(4, "weeks").toDate()),
                    endDate: dueDate(MyDate.Now().subtract(4, "weeks").toDate()),
                }, 1))[0];

                await createTasks({
                    title: "middle", 
                    active: false,
                    startDate: MyDate.Now().subtract(6, "weeks").toDate(),
                    parentId: opts.goalId,
                }, 1)

                await createTasks({
                    title: "latest", 
                    active: false,
                    startDate: MyDate.Now().subtract(4, "weeks").toDate(),
                    parentId: cycle.id,
                }, 2)

                await createTasks({
                    title: "oldest", 
                    active: false,
                    startDate: MyDate.Now().subtract(7, "weeks").toDate(),
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
            const cycles = await new StreakCycleQuery().all();
            expect(cycles.length).toBe(1);
        })

        await new GoalLogic(goalId).generateNextStreakTasks();

        await wait(async () => {
            const tasks = await new TaskQuery().all();
            expect(tasks.length).toBe(4 + 2 * 4);
            const cycles = await new StreakCycleQuery().all();
            expect(cycles.length).toBe(1 + 4);
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
                    startDate: startDate(MyDate.Now().subtract(10, "months").toDate()),
                    dueDate: dueDate(MyDate.Now().add(10, "months").toDate()),
                    streakType: "monthly",
                    latestCycleId: "",
                }, 1)

                opts.goalId = goals[0].id;

                const cycle = (await createStreakCycles({
                    parentGoalId: opts.goalId,
                    startDate: startDate(MyDate.Now().subtract(4, "months").toDate()),
                    endDate: dueDate(MyDate.Now().subtract(4, "months").toDate()),
                }, 1))[0];

                await createTasks({
                    title: "middle", 
                    active: false,
                    startDate: MyDate.Now().subtract(6, "months").toDate(),
                    parentId: opts.goalId,
                }, 1)

                await createTasks({
                    title: "latest", 
                    active: false,
                    startDate: MyDate.Now().subtract(4, "months").toDate(),
                    parentId: cycle.id,
                }, 2)

                await createTasks({
                    title: "oldest", 
                    active: false,
                    startDate: MyDate.Now().subtract(7, "months").toDate(),
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
            const goals = await new ActiveGoalQuery().unprocessed();
            expect(goals.length).toEqual(0)
        });

        await setup();

        await wait(async () => {
            const goals = await new ActiveGoalQuery().unprocessed();
            expect(goals.length).toEqual(3)
        });

        await GoalLogic.processSomeStreaks(2);

        await wait(async () => {
            const goals = await new ActiveGoalQuery().unprocessed();
            expect(goals.length).toEqual(1)
        });

        await GoalLogic.processSomeStreaks(2);

        await wait(async () => {
            const goals = await new ActiveGoalQuery().unprocessed();
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
                    lastRefreshed: MyDate.Now().subtract(1, "days").toDate(),
                }, 1)

                opts.goal_1 = goal_1[0].id;

                const goal_2 = await createGoals({
                    streakType: "weekly",
                    goalType: GoalType.STREAK,
                    active: true,
                    lastRefreshed: MyDate.Now().subtract(1, "days").toDate(),
                }, 1)

                opts.goal_2 = goal_2[0].id;

                const goal_3 = await createGoals({
                    streakType: "monthly",
                    goalType: GoalType.STREAK,
                    active: true,
                    lastRefreshed: MyDate.Now().subtract(2, "days").toDate(),
                }, 1)

                opts.goal_3 = goal_3[0].id;

                const goal_4 = await createGoals({
                    streakType: "daily",
                    goalType: GoalType.STREAK,
                    active: true,
                    lastRefreshed: MyDate.Now().toDate(),
                }, 1)

                opts.goal_4 = goal_4[0].id;

                const goal_5 = await createGoals({
                    streakType: "daily",
                    goalType: GoalType.STREAK,
                    active: false,
                    lastRefreshed: MyDate.Now().toDate(),
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
            const goals = await new ActiveGoalQuery().unprocessed();
            expect(goals.length).toEqual(1)
        });

        await wait(async () => {
            const tasks = await new ActiveTaskQuery().all();
            expect(tasks.length).toEqual(0);
        })

        await GoalLogic.processSomeStreaks(2);

        await wait(async () => {
            const goals = await new ActiveGoalQuery().unprocessed();
            expect(goals.length).toEqual(0)
        });

        await wait(async () => {
            const tasks = await new ActiveTaskQuery().all();
            expect(tasks.length).toEqual(1);
        })

        async function setup() {
            await DB.get().action(async () => {
                const goal_1 = (await createGoals({
                    streakType: "daily",
                    goalType: GoalType.STREAK,
                    active: true,
                    startDate: startDate(MyDate.Now().subtract(10, "days").toDate()),
                    dueDate: dueDate(MyDate.Now().add(10, "days").toDate()),
                    latestCycleId: "",
                    lastRefreshed: MyDate.Now().subtract(1, "days").toDate(),
                }, 1))[0];
                const cycle = (await createStreakCycles({
                    parentGoalId: goal_1.id,
                    startDate: startDate(MyDate.Now().subtract(1, "days").toDate()),
                    endDate: dueDate(MyDate.Now().subtract(1, "days").toDate()),
                }, 1))[0];
                await createTasks({
                    title: "latest", 
                    active: false,
                    startDate: MyDate.Now().subtract(1, "days").toDate(),
                    parentId: cycle.id,
                }, 1)
            });

        }
    })
});


describe("streak goals generate tasks correctly from one cycle to the next", async () => {
    beforeEach(() => {
        MyDate.TEST_ONLY_SetNow(MyDate.Zero());
    })
    afterEach(async () => {
        await destroyAll();
    })

    test("daily", async () => {
        const { goalId, firstCycleId } = await setup();
        const originalDate = MyDate.Now();

        expect(MyDate.Now().equals(new MyDate(new Date()))).toBeTruthy();

        await wait(async () => {
            const goals = await new GoalQuery().all();
            const tasks = await new TaskQuery().all();
            const cycles = await new StreakCycleQuery().all();
            const latestCycle = await new ChildStreakCycleQuery(goalId).latest();

            expect(goals.length).toEqual(1);
            expect(tasks.length).toEqual(2);
            expect(cycles.length).toEqual(1);

            if(!latestCycle) {
                throw new Error("latest goal is not correct");
            }
            expect(latestCycle.id === firstCycleId).toEqual(true);
            expect(new MyDate(latestCycle.startDate).equals(new MyDate(goals[0].currentCycleStart()))).toBeTruthy();
            expect(new MyDate(latestCycle.endDate).equals(new MyDate(goals[0].currentCycleEnd()))).toBeTruthy();
            expect(new MyDate(latestCycle.startDate).equals(new MyDate(goals[0].startDate))).toBeTruthy();
        })

        MyDate.TEST_ONLY_NowAdd(1, "days");
        await new GoalLogic(goalId).generateNextStreakTasks();
        await wait(async () => {
            const goals = await new GoalQuery().all();
            expect(MyDate.Now().asStartDate().toDate()).toEqual(goals[0].currentCycleStart());
            expect(MyDate.Now().asDueDate().toDate()).toEqual(goals[0].currentCycleEnd());
            const tasks = await new TaskQuery().all();
            const cycles = await new StreakCycleQuery().all();

            expect(goals.length).toEqual(1);
            expect(cycles.length).toEqual(2);
            expect(tasks.length).toEqual(2 * 2);

            const latestCycle = await new ChildStreakCycleQuery(goalId).latest();
            if(!latestCycle) {
                throw new Error("latest goal is not correct");
            }

            const currentCycleStart = new MyDate(goals[0].currentCycleStart());
            expect(latestCycle.id !== firstCycleId).toEqual(true);
            expect(new MyDate(latestCycle.startDate).equals(currentCycleStart)).toBeTruthy();
            expect(new MyDate(latestCycle.endDate).equals(new MyDate(goals[0].currentCycleEnd()))).toBeTruthy();
            expect(new MyDate(latestCycle.startDate).equals(MyDate.Now().asStartDate())).toBeTruthy();

            const latestTasks = (await new ChildTaskQuery(latestCycle.id).all());
            expect(latestTasks.length).toEqual(2);
            expect( latestTasks[0].startDate).toEqual(latestCycle.startDate);
            expect( latestTasks[0].startDate).toEqual(currentCycleStart.toDate());
            expect( new MyDate(latestTasks[0].startDate).equals(currentCycleStart) ).toBeTruthy();
        })

        MyDate.TEST_ONLY_NowAdd(1, "days");
        await new GoalLogic(goalId).generateNextStreakTasks();
        await wait(async () => {
            const goals = await new GoalQuery().all();
            const tasks = await new TaskQuery().all();
            const cycles = await new StreakCycleQuery().all();
            expect(goals.length).toEqual(1);
            expect(tasks.length).toEqual(2 * 3);
            expect(cycles.length).toEqual(3);

            const latestCycle = await new ChildStreakCycleQuery(goalId).latest();
            if(!latestCycle) {
                throw new Error("latest goal is not correct");
            }
            expect(latestCycle.id !== firstCycleId).toEqual(true);
            expect(new MyDate(latestCycle.startDate).equals(new MyDate(goals[0].currentCycleStart()))).toBeTruthy();
            expect(new MyDate(latestCycle.endDate).equals(new MyDate(goals[0].currentCycleEnd()))).toBeTruthy();
            expect(new MyDate(latestCycle.startDate).equals(MyDate.Now().asStartDate())).toBeTruthy();
            expect((await new ChildTaskQuery(latestCycle.id).all()).length).toEqual(2);
        })

        MyDate.TEST_ONLY_NowAdd(1, "days");
        await new GoalLogic(goalId).generateNextStreakTasks();
        await wait(async () => {
            const goals = await new GoalQuery().all();
            const tasks = await new TaskQuery().all();
            const cycles = await new StreakCycleQuery().all();
            expect(goals.length).toEqual(1);
            expect(tasks.length).toEqual(2 * 4);
            expect(cycles.length).toEqual(4);

            const latestCycle = await new ChildStreakCycleQuery(goalId).latest();
            if(!latestCycle) {
                throw new Error("latest goal is not correct");
            }
            const currentCycleStart = new MyDate(goals[0].currentCycleStart());

            expect(latestCycle.id !== firstCycleId).toEqual(true);
            expect(new MyDate(latestCycle.startDate).equals(currentCycleStart)).toBeTruthy();
            expect(new MyDate(latestCycle.endDate).equals(new MyDate(goals[0].currentCycleEnd()))).toBeTruthy();
            expect(new MyDate(latestCycle.startDate).equals(MyDate.Now().asStartDate())).toBeTruthy();
            const latestTasks = (await new ChildTaskQuery(latestCycle.id).all());
            expect(latestTasks.length).toEqual(2);
            expect( currentCycleStart.equals(originalDate.clone().add(3, "days").asStartDate())).toBeTruthy();
            expect( latestTasks[0].startDate).toEqual(currentCycleStart.toDate());
            expect( new MyDate(latestTasks[0].startDate).equals(currentCycleStart) ).toBeTruthy();
        })

        async function setup() {
            const opts = {
                goalId: "",
                firstCycleId: "",
            }

            await DB.get().action(async () => {
                const goal = (await createGoals({
                    title: "Parent",
                    active: true,
                    goalType: GoalType.STREAK,
                    startDate: MyDate.Now().asStartDate().toDate(),
                    dueDate: MyDate.Now().add(7, "days").asDueDate().toDate(),
                    streakType: "daily",
                    lastRefreshed: MyDate.Now().toDate(),
                    latestCycleId: "",
                }, 1))[0];


                const cycle = (await createStreakCycles({
                    parentGoalId: goal.id,
                    startDate: goal.currentCycleStart(),
                    endDate: goal.currentCycleEnd(),
                }, 1))[0];

                const tasks = (await createTasks({
                    active: true,
                    parentId: cycle.id,
                    startDate: cycle.startDate,
                    dueDate: cycle.endDate,
                }, 2));

                opts.goalId = goal.id;
                opts.firstCycleId = cycle.id;
            })


            return opts;
        }
    }, 20000)
})