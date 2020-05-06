
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";

import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAll,
    createTasks,
    createRecurrences,
} from "src/common/test-utils";
import MyDate from "src/common/Date";

import RecurQuery, { RecurLogic } from "src/Models/Recurrence/RecurQuery";
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
        const {recurId} = await setup();

        await wait(async () => {
            const tasks = await new TaskQuery().inRecurrence(recurId);
            expect(tasks.length).toEqual(5);
        })

        await new RecurLogic(recurId).generateNext();

        await wait(async () => {
            const tasks = await new TaskQuery().inRecurrence(recurId);
            expect(tasks.length).toEqual(5 + 2);
        })

        async function setup() {
            const opts = {
                recurId: "",
            }
            await DB.get().action(async () => {
                const recurs = await createRecurrences({
                    type: "daily",
                    active: true,
                }, 1)

                opts.recurId = recurs[0].id;

                await createTasks({
                    parent: {
                        id: opts.recurId,
                        type: TaskParentTypes.RECUR,
                    },
                    title: "Older",
                    active: true,
                    startDate: MyDate.Now().subtract(3, "days").toDate(),
                    dueDate: MyDate.Now().subtract(3, "days").add(30, "minutes").toDate(),
                    
                }, 2)

                await createTasks({
                    parent: {
                        id: opts.recurId,
                        type: TaskParentTypes.RECUR,
                    },
                    title: "Latest",
                    active: true,
                    startDate: MyDate.Now().subtract(2, "days").toDate(),
                    dueDate: MyDate.Now().subtract(2, "days").add(30, "minutes").toDate(),
                }, 1)

                await createTasks({
                    parent: {
                        id: opts.recurId,
                        type: TaskParentTypes.RECUR,
                    },
                    title: "Oldest",
                    active: true,
                    startDate: MyDate.Now().subtract(5, "days").toDate(),
                    dueDate: MyDate.Now().subtract(5, "days").add(30, "minutes").toDate(),
                }, 2)

                await createTasks({
                    title: "Unrelated",
                    active: true,
                    startDate: MyDate.Now().subtract(2, "days").toDate(),
                    dueDate: MyDate.Now().subtract(2, "days").add(30, "minutes").toDate(),
                }, 1)
            })
            return opts;
        }
    })

    test("weekly", async () => {
        const {recurId} = await setup();

        await wait(async () => {
            const tasks = await new TaskQuery().inRecurrence(recurId);
            expect(tasks.length).toEqual(5);
        })

        await new RecurLogic(recurId).generateNext();

        await wait(async () => {
            const tasks = await new TaskQuery().inRecurrence(recurId);
            expect(tasks.length).toEqual(5 + 2);
        })

        async function setup() {
            const opts = {
                recurId: "",
            }
            await DB.get().action(async () => {
                const recurs = await createRecurrences({
                    type: "weekly",
                    active: true,
                }, 1)

                opts.recurId = recurs[0].id;

                await createTasks({
                    parent: {
                        id: opts.recurId,
                        type: TaskParentTypes.RECUR,
                    },
                    title: "Older",
                    active: true,
                    startDate: MyDate.Now().subtract(3, "weeks").toDate(),
                    dueDate: MyDate.Now().subtract(3, "weeks").add(30, "minutes").toDate(),
                    
                }, 2)

                await createTasks({
                    parent: {
                        id: opts.recurId,
                        type: TaskParentTypes.RECUR,
                    },
                    title: "Latest",
                    active: true,
                    startDate: MyDate.Now().subtract(2, "weeks").toDate(),
                    dueDate: MyDate.Now().subtract(2, "weeks").add(30, "minutes").toDate(),
                }, 1)

                await createTasks({
                    parent: {
                        id: opts.recurId,
                        type: TaskParentTypes.RECUR,
                    },
                    title: "Oldest",
                    active: true,
                    startDate: MyDate.Now().subtract(5, "weeks").toDate(),
                    dueDate: MyDate.Now().subtract(5, "weeks").add(30, "minutes").toDate(),
                }, 2)

                await createTasks({
                    title: "Unrelated",
                    active: true,
                    startDate: MyDate.Now().subtract(2, "weeks").toDate(),
                    dueDate: MyDate.Now().subtract(2, "weeks").add(30, "minutes").toDate(),
                }, 1)
            })
            return opts;
        }

    })

    test("monthly", async () => {
        const {recurId} = await setup();

        await wait(async () => {
            const tasks = await new TaskQuery().inRecurrence(recurId);
            expect(tasks.length).toEqual(5);
        })

        await new RecurLogic(recurId).generateNext();

        await wait(async () => {
            const tasks = await new TaskQuery().inRecurrence(recurId);
            expect(tasks.length).toEqual(5 + 2);
        })

        async function setup() {
            const opts = {
                recurId: "",
            }
            await DB.get().action(async () => {
                const recurs = await createRecurrences({
                    type: "monthly",
                    active: true,
                }, 1)

                opts.recurId = recurs[0].id;

                await createTasks({
                    parent: {
                        id: opts.recurId,
                        type: TaskParentTypes.RECUR,
                    },
                    title: "Older",
                    active: true,
                    startDate: MyDate.Now().subtract(3, "months").toDate(),
                    dueDate: MyDate.Now().subtract(3, "months").add(30, "minutes").toDate(),
                    
                }, 2)

                await createTasks({
                    parent: {
                        id: opts.recurId,
                        type: TaskParentTypes.RECUR,
                    },
                    title: "Latest",
                    active: true,
                    startDate: MyDate.Now().subtract(2, "months").toDate(),
                    dueDate: MyDate.Now().subtract(2, "months").add(30, "minutes").toDate(),
                }, 1)

                await createTasks({
                    parent: {
                        id: opts.recurId,
                        type: TaskParentTypes.RECUR,
                    },
                    title: "Oldest",
                    active: true,
                    startDate: MyDate.Now().subtract(5, "months").toDate(),
                    dueDate: MyDate.Now().subtract(5, "months").add(30, "minutes").toDate(),
                }, 2)

                await createTasks({
                    title: "Unrelated",
                    active: true,
                    startDate: MyDate.Now().subtract(2, "months").toDate(),
                    dueDate: MyDate.Now().subtract(2, "months").add(30, "minutes").toDate(),
                }, 1)
            })
            return opts;
        }
    })

});

describe("Processing partially processed recurrences", () => {
    beforeEach(async () => {
        await destroyAll();
    })

    afterEach(async () => {
        await destroyAll();
    })

    test("daily", async () => {
        await wait(async () => {
            const recurs = await new RecurQuery().dailyUnprocessed();
            expect(recurs.length).toEqual(0)
        });

        await setup();

        await wait(async () => {
            const recurs = await new RecurQuery().dailyUnprocessed();
            expect(recurs.length).toEqual(3)
        });

        await RecurLogic.processSomeDailyRecurrences(2);

        await wait(async () => {
            const recurs = await new RecurQuery().dailyUnprocessed();
            expect(recurs.length).toEqual(1)
        });

        await RecurLogic.processSomeDailyRecurrences(2);

        await wait(async () => {
            const recurs = await new RecurQuery().dailyUnprocessed();
            expect(recurs.length).toEqual(0)
        });

        async function setup() {
            const opts = {
                recur_1: "",
                recur_2: "",
                recur_3: "",
                recur_4: "",
                recur_5: "",
            }
            await DB.get().action(async () => {
                const recur_1 = await createRecurrences({
                    type: "daily",
                    active: true,
                    lastRefreshed: MyDate.Now().subtract(1, "days").toDate(),
                }, 1)

                opts.recur_1 = recur_1[0].id;

                const recur_2 = await createRecurrences({
                    type: "daily",
                    active: true,
                    lastRefreshed: MyDate.Now().subtract(1, "days").toDate(),
                }, 1)

                opts.recur_2 = recur_2[0].id;

                const recur_3 = await createRecurrences({
                    type: "daily",
                    active: true,
                    lastRefreshed: MyDate.Now().subtract(2, "days").toDate(),
                }, 1)

                opts.recur_3 = recur_3[0].id;

                const recur_4 = await createRecurrences({
                    type: "daily",
                    active: true,
                    lastRefreshed: MyDate.Now().toDate(),
                }, 1)

                opts.recur_4 = recur_4[0].id;

                const recur_5 = await createRecurrences({
                    type: "daily",
                    active: false,
                    lastRefreshed: MyDate.Now().toDate(),
                }, 1)

                opts.recur_5 = recur_5[0].id;

            })
            return opts;
        }
    });

    test("weekly", async () => {
        await wait(async () => {
            const recurs = await new RecurQuery().weeklyUnprocessed();
            expect(recurs.length).toEqual(0)
        });

        await setup();

        await wait(async () => {
            const recurs = await new RecurQuery().weeklyUnprocessed();
            expect(recurs.length).toEqual(5)
        });

        await RecurLogic.processSomeWeeklyRecurrences(3);

        await wait(async () => {
            const recurs = await new RecurQuery().weeklyUnprocessed();
            expect(recurs.length).toEqual(2)
        });

        await RecurLogic.processSomeWeeklyRecurrences(3);

        await wait(async () => {
            const recurs = await new RecurQuery().weeklyUnprocessed();
            expect(recurs.length).toEqual(0)
        });

        async function setup() {
            const opts = {
                recur_1: "",
                recur_2: "",
                recur_3: "",
                recur_4: "",
                recur_5: "",
            }
            await DB.get().action(async () => {
                const recur_1 = await createRecurrences({
                    type: "weekly",
                    active: true,
                    lastRefreshed: MyDate.Now().subtract(1, "weeks").toDate(),
                }, 1)

                opts.recur_1 = recur_1[0].id;

                const recur_2 = await createRecurrences({
                    type: "weekly",
                    active: true,
                    lastRefreshed: MyDate.Now().subtract(1, "weeks").toDate(),
                }, 1)

                opts.recur_2 = recur_2[0].id;

                const recur_3 = await createRecurrences({
                    type: "weekly",
                    active: true,
                    lastRefreshed: MyDate.Now().subtract(2, "weeks").toDate(),
                }, 3)

                opts.recur_3 = recur_3[0].id;

                const recur_4 = await createRecurrences({
                    type: "weekly",
                    active: true,
                    lastRefreshed: MyDate.Now().toDate(),
                }, 1)

                opts.recur_4 = recur_4[0].id;

                const recur_5 = await createRecurrences({
                    type: "weekly",
                    active: false,
                    lastRefreshed: MyDate.Now().subtract(5, "weeks").toDate(),
                }, 1)

                opts.recur_5 = recur_5[0].id;

                await createRecurrences({
                    type: "daily",
                    active: true,
                    lastRefreshed: MyDate.Now().subtract(2, "weeks").toDate(),
                }, 1)
            })
            return opts;
        }
    });

    test("monthly", async () => {
        await wait(async () => {
            const recurs = await new RecurQuery().monthlyUnprocessed();
            expect(recurs.length).toEqual(0)
        });

        await setup();

        await wait(async () => {
            const recurs = await new RecurQuery().monthlyUnprocessed();
            expect(recurs.length).toEqual(5)
        });

        await RecurLogic.processSomeMonthlyRecurrences(3);

        await wait(async () => {
            const recurs = await new RecurQuery().monthlyUnprocessed();
            expect(recurs.length).toEqual(2)
        });

        await RecurLogic.processSomeMonthlyRecurrences(3);

        await wait(async () => {
            const recurs = await new RecurQuery().monthlyUnprocessed();
            expect(recurs.length).toEqual(0)
        });

        async function setup() {
            const opts = {
                recur_1: "",
                recur_2: "",
                recur_3: "",
                recur_4: "",
                recur_5: "",
            }
            await DB.get().action(async () => {
                const recur_1 = await createRecurrences({
                    type: "monthly",
                    active: true,
                    lastRefreshed: MyDate.Now().subtract(1, "months").toDate(),
                }, 1)

                opts.recur_1 = recur_1[0].id;

                const recur_2 = await createRecurrences({
                    type: "monthly",
                    active: true,
                    lastRefreshed: MyDate.Now().subtract(1, "months").toDate(),
                }, 1)

                opts.recur_2 = recur_2[0].id;

                const recur_3 = await createRecurrences({
                    type: "monthly",
                    active: true,
                    lastRefreshed: MyDate.Now().subtract(2, "months").toDate(),
                }, 3)

                opts.recur_3 = recur_3[0].id;

                const recur_4 = await createRecurrences({
                    type: "monthly",
                    active: true,
                    lastRefreshed: MyDate.Now().toDate(),
                }, 1)

                opts.recur_4 = recur_4[0].id;

                const recur_5 = await createRecurrences({
                    type: "monthly",
                    active: false,
                    lastRefreshed: MyDate.Now().subtract(5, "months").toDate(),
                }, 1)

                await createRecurrences({
                    type: "daily",
                    active: true,
                    lastRefreshed: MyDate.Now().subtract(2, "weeks").toDate(),
                }, 1)
            })
            return opts;
        }
    });
})