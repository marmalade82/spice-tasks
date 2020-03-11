
jest.mock("src/Models/Database");
import React from "react";
import DB from "src/Models/Database";
import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAllIn,
    createGoals, createTasks, destroyAll,
} from "src/common/test-utils";

import MyDate from "src/common/Date";

import DashboardScreen from "src/Screens/Prototypes/Dashboard/DashboardScreen";
import TaskQuery from "src/Models/Task/TaskQuery";

describe("First view: Due", () => {
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

        async function setup() {
            await DB.get().action(async () => {
                await createTasks({
                    active: true,
                    dueDate: new MyDate().toDate(),
                    state: "in_progress",
                }, 3)

                await createTasks({
                    active: true,
                    dueDate: new MyDate().nextMidnight().subtract(1, "minutes").toDate(),
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

    }, 10000)

    test("Initially user can see all active goals due today", async () => {
        await setup();

        const { queryAllByLabelText } = render(
            <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
        );

        {
            await wait(() => {
                const dueGoals = queryAllByLabelText("goal-list-item");
                expect(dueGoals.length).toEqual(4)
            });


        }

        await teardown();

        async function setup() {
            await DB.get().action(async () => {
                await createGoals({
                    active: true,
                    dueDate: new MyDate().toDate(),
                    state: "in_progress",
                }, 3)

                await createGoals({
                    active: true,
                    dueDate: new MyDate().nextMidnight().subtract(1, "minutes").toDate(),
                    state: "in_progress"
                }, 1)

                await createGoals({
                    active: false,
                    dueDate: new MyDate().toDate(),
                    state: "in_progress",
                }, 2)
            });
        }

        async function teardown() {
            await destroyAllIn('goals');
        }

    }, 10000)

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

    test("Initially user can see all active overdue goals", async () => {
        await setup();

        const { queryAllByLabelText } = render(
            <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
        );

        {
            await wait(() => {
                const overdueGoals = queryAllByLabelText("goal-list-item");
                expect(overdueGoals.length).toEqual(4)
            });
        }

        await teardown();

        async function setup() {
            await DB.get().action(async () => {
                await createGoals({
                    active: true,
                    dueDate: new MyDate().subtract(1, "days").toDate(),
                    state: "in_progress",
                }, 3)

                await createGoals({
                    active: true,
                    dueDate: new MyDate().subtract(2, "days").toDate(),
                    state: "in_progress",
                }, 1)

                await createGoals({
                    active: false,
                    dueDate: new MyDate().subtract(1, "days").toDate(),
                    state: "in_progress",
                }, 2)
            });
        }

        async function teardown() {
            await destroyAllIn('goals');
        }
    });

    test("User can see all active goals due today or overdue, along with any active due/overdue non-child tasks", async () => {
        await setup();

        const { queryAllByLabelText } = render(
            <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
        );

        {
            await wait(() => {
                const dueGoals = queryAllByLabelText("goal-list-item");
                expect(dueGoals.length).toEqual(5);

                const childTasks = queryAllByLabelText("task-list-item");
                expect(childTasks.length).toEqual(3)
            });
        }

        await teardown();
        
        async function setup() {
            await DB.get().action(async () => {
                await createGoals({
                    active: true,
                    title: "Due goal",
                    dueDate: new MyDate().prevMidnight().add(1, "hours").toDate(),
                }, 3);

                await createGoals({
                    active: true,
                    title: "Overdue goal",
                    dueDate: new MyDate().subtract(1, "days").toDate()
                }, 2);

                await createGoals({
                    active: true,
                    title: "Not due goal",
                    dueDate: new MyDate().add(1, "days").toDate()
                }, 1);

                await createTasks({
                    active: true,
                    title: "Overdue task",
                    dueDate: new MyDate().subtract(1, "days").toDate()
                }, 1);

                await createTasks({
                    active: true,
                    title: "Due task",
                    dueDate: new MyDate().prevMidnight().add(1, "minutes").toDate(),
                }, 2);

                await createTasks({
                    active: true,
                    title: "Not due task",
                    dueDate: new MyDate().add(1, "days").toDate(),
                }, 7)
            })
        }

        async function teardown() {
            await destroyAllIn('goals');
            await destroyAllIn('tasks');
        }
    });

    test("User can see an active goal that is due today or overdue, but not its due/overdue child tasks", async() => {
        await setup();

        const { queryAllByLabelText } = render(
            <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
        );

        await wait(() => {
            const goals = queryAllByLabelText("goal-list-item")
            expect(goals.length).toEqual(1)

            const tasks = queryAllByLabelText('task-list-item');
            expect(tasks.length).toEqual(0);
        })

        await teardown();

        async function setup() {
            await DB.get().action(async() => {
                const goal = (await createGoals({
                    active: true,
                    title: "Parent goal",
                    startDate: new MyDate().subtract(5, "days").toDate(),
                    dueDate: new MyDate().nextMidnight().subtract(1, "days").toDate(),
                }, 1))[0]

                await createTasks({
                    parentId: goal.id,
                    active: true,
                    title: "Due today tasks",
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().nextMidnight().subtract(1, "minutes").toDate(),
                }, 2) 

                await createTasks({
                    parentId: goal.id,
                    active: true,
                    title: "Overdue tasks",
                    startDate: new MyDate().subtract(2, "days").toDate(),
                    dueDate: new MyDate().subtract(1, "days").toDate(),
                }, 1) 
            });
        }

        async function teardown() {
           await destroyAllIn('goals'); 
           await destroyAllIn('tasks');
        }
    }, 10000);

    test("User can see an active goal that is due today or overdue, but not due/overdue child goals", async() => {
        await setup();

        const { queryAllByLabelText, getByText, getByDisplayValue, queryAllByText } = render(
            <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
        );

        await wait(() => {
            const goals = queryAllByLabelText("goal-list-item")
            expect(goals.length).toEqual(1)
        })

        await teardown();

        async function setup() {
            await DB.get().action(async() => {
                const goal = (await createGoals({
                    active: true,
                    title: "Parent goal",
                    startDate: new MyDate().subtract(5, "days").toDate(),
                    dueDate: new MyDate().nextMidnight().subtract(1, "days").toDate(),
                }, 1))[0]

                await createGoals({
                    parentId: goal.id,
                    active: true,
                    title: "Due today tasks",
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().nextMidnight().subtract(1, "minutes").toDate(),
                }, 2) 

                await createGoals({
                    parentId: goal.id,
                    active: true,
                    title: "Overdue tasks",
                    startDate: new MyDate().subtract(2, "days").toDate(),
                    dueDate: new MyDate().subtract(1, "days").toDate(),
                }, 3) 
            });
        }

        async function teardown() {
           await destroyAllIn('goals'); 
           await destroyAllIn('tasks');
        }
    }, 20000);

    test("User can see an active task that is due today or overdue, but not its due/overdue child tasks", async() => {
        await setup();

        const { queryAllByLabelText } = render(
            <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
        );

        await wait(() => {
            const goals = queryAllByLabelText("task-list-item")
            expect(goals.length).toEqual(1)
        })

        await teardown();

        async function setup() {
            await DB.get().action(async() => {
                const task = (await createTasks({
                    active: true,
                    title: "Parent task",
                    startDate: new MyDate().subtract(5, "days").toDate(),
                    dueDate: new MyDate().nextMidnight().subtract(1, "days").toDate(),
                }, 1))[0]

                await createTasks({
                    parentId: task.id,
                    active: true,
                    title: "Due today tasks",
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().nextMidnight().subtract(1, "minutes").toDate(),
                }, 2) 

                await createTasks({
                    parentId: task.id,
                    active: true,
                    title: "Overdue tasks",
                    startDate: new MyDate().subtract(2, "days").toDate(),
                    dueDate: new MyDate().subtract(1, "days").toDate(),
                }, 2) 
            });
        }

        async function teardown() {
           await destroyAllIn('goals'); 
           await destroyAllIn('tasks');
        }
    }, 10000);
});

describe("Second view: In Progress", () => {
    test("User can switch views to Second View and see all active tasks that aren't due yet", async() => {
        await setup();

        const { getByLabelText, queryAllByLabelText } = render(
            <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
        );
        
        const tasks = await new TaskQuery().queryActiveAndStartedButNotDue().fetch();
        debugger;

        const viewTwo = getByLabelText("input-view-2-lists");
        fireEvent.press(viewTwo)

        await wait(() => {
            const activeTasks = queryAllByLabelText("task-list-item");
            expect(activeTasks.length).toEqual(3);
        });

        await teardown();

        async function setup() {
            await DB.get().action(async () => {
                await createTasks({
                    active: true,
                    title: "Active but not due",
                    dueDate: new MyDate().add(2, "days").toDate(),
                    startDate: new MyDate().subtract(1, "hours").toDate(),
                }, 3);

                await createTasks({
                    active: true,
                    title: "Active but due",
                    dueDate: new MyDate().toDate(),
                    startDate: new MyDate().subtract(1, "hours").toDate(),
                }, 1)

                await createTasks({
                    active: false,
                    title: "Inactive",
                    dueDate: new MyDate().toDate(),
                    startDate: new MyDate().subtract(1, "hours").toDate(),
                }, 2);
            });
        }

        async function teardown() {
            await destroyAllIn('tasks');
        }
    });

    test("User can switch to Second View and see all goals and tasks that aren't due yet", async () => {
        await setup();

        const { getByLabelText, queryAllByLabelText } = render(
            <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
        );
        
        const viewTwo = getByLabelText("input-view-2-lists");
        fireEvent.press(viewTwo)

        await wait(() => {
            const goals = queryAllByLabelText("goal-list-item");
            expect(goals.length).toEqual(1);
            const tasks = queryAllByLabelText("task-list-item");
            expect(tasks.length).toEqual(7);
        });

        await teardown();

        async function setup() {
            await DB.get().action(async () => {
                await createGoals({
                    active: true,
                    title: "Not due goal",
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().add(1, "days").toDate(),
                }, 1)[0];

                await createGoals({
                    active: true,
                    title: "Due today goal",
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().nextMidnight().subtract(1, "minutes").toDate(),
                }, 3)[0];

                await createGoals({
                    active: true,
                    title: "Overdue goal",
                    startDate: new MyDate().subtract(2, "days").toDate(),
                    dueDate: new MyDate().subtract(1, "days").toDate()
                }, 2)[0];

                await createTasks({
                    active: true,
                    title: "Not due task",
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().add(1, "days").toDate(),
                }, 7)

                await createTasks({
                    active: true,
                    title: "Overdue task",
                    startDate: new MyDate().subtract(2, "days").toDate(),
                    dueDate: new MyDate().subtract(1, "days").toDate()
                }, 1);

                await createTasks({
                    active: true,
                    title: "Due today task",
                    startDate: new MyDate().subtract(2, "days").toDate(),
                    dueDate: new MyDate().nextMidnight().subtract(1, "minutes").toDate(),
                }, 2);

            })
        }

        async function teardown() {
            await destroyAllIn('goals');
            await destroyAllIn('tasks');
        }
    }, 20000);


    test("For a goal, child tasks and goals do not show", async () => {
        await setup(); 

        {
            const { getByLabelText, queryAllByLabelText } = render(
                <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
            );
            
            const viewTwo = getByLabelText("input-view-2-lists");
            fireEvent.press(viewTwo)

            await wait(() => {
                const goal = queryAllByLabelText("goal-list-item");
                expect(goal.length).toEqual(1);
            });
        }

        {
            const { getByLabelText, queryAllByLabelText } = render(
                <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
            );
            
            const viewTwo = getByLabelText("input-view-2-lists");
            fireEvent.press(viewTwo)

            await wait(() => {
                const task = queryAllByLabelText("task-list-item");
                expect(task.length).toEqual(0);
            });
        }

        await teardown();

        async function setup() {
            await DB.get().action(async () => {
                const goal = (await createGoals({
                    active: true,
                    title: "Not due goal",
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().add(1, "days").toDate(),
                }, 1))[0];

                await createGoals({
                    parentId: goal.id,
                    active: true,
                    title: "Not due child goal",
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().add(1, "days").toDate(),
                }, 2)

                await createTasks({
                    parentId: goal.id,
                    active: true,
                    title: "Not due child task",
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().add(1, "days").toDate(),
                }, 2)
            });
        }

        async function teardown() {
            await destroyAll();
        }

    })

    test("For a task, child tasks and do not show", async () => {
        await setup(); 

        {
            const { getByLabelText, queryAllByLabelText } = render(
                <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
            );
            
            const viewTwo = getByLabelText("input-view-2-lists");
            fireEvent.press(viewTwo)

            await wait(() => {
                const task = queryAllByLabelText("task-list-item");
                expect(task.length).toEqual(1);
            });
        }

        await teardown();

        async function setup() {
            await DB.get().action(async () => {
                const task = (await createTasks({
                    active: true,
                    title: "Not due task",
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().add(1, "days").toDate(),
                }, 1))[0];

                await createTasks({
                    parentId: task.id,
                    active: true,
                    title: "Not due child task",
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().add(1, "days").toDate(),
                }, 2)
            });
        }

        async function teardown() {
            await destroyAll();
        }

    })
})

describe("Third view", () => {
    test("User can switch views to Third View and see upcoming goals and tasks", async () => {
        await setup()

        {
            const { getByLabelText, queryAllByLabelText } = render(
                <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
            );

            const viewThree = getByLabelText("input-view-3-lists");
            fireEvent.press(viewThree)
            await wait(() => {
                const task = queryAllByLabelText("task-list-item");
                expect(task.length).toEqual(1);
            });
        }

        {
            const { getByLabelText, queryAllByLabelText } = render(
                <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
            );

            const viewThree = getByLabelText("input-view-3-lists");
            fireEvent.press(viewThree)
            await wait(() => {
                const goal = queryAllByLabelText("goal-list-item");
                expect(goal.length).toEqual(1);
            });
        }


        await teardown() 

        async function setup() {
            await DB.get().action(async () => {
                await createGoals({
                    active: true,
                    title: "Upcoming goal",
                    startDate: new MyDate().add(1, "days").toDate(),
                    dueDate: new MyDate().add(2, "days").toDate()
                }, 1);

                await createTasks({
                    active: true,
                    title: "Upcoming task",
                    startDate: new MyDate().add(1, "days").toDate(),
                    dueDate: new MyDate().add(2, "days").toDate()
                }, 1);

                await createGoals({
                    active: true,
                    title: "In progress goal",
                    startDate: new MyDate().subtract(1, "days").toDate(),
                    dueDate: new MyDate().add(1, "days").toDate(),

                }, 3)

                await createTasks({
                    active: true,
                    title: "Overdue task",
                    startDate: new MyDate().subtract(2, "days").toDate(),
                    dueDate: new MyDate().subtract(1, "days").toDate(),

                }, 3)

                await createTasks({
                    active: false,
                    title: "Inactive upcoming task",
                    startDate: new MyDate().add(1, "days").toDate(),
                    dueDate: new MyDate().add(2, "days").toDate()
                }, 3)
            });
        }

        async function teardown() {
            await destroyAllIn("goals");
            await destroyAllIn("tasks");
        }
    }, 10000);
})

test("User can access menu", async () => {
    const { getByLabelText } = render(
        <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
    );

    const viewThree = getByLabelText("input-view-3-lists");
    fireEvent.press(viewThree)
    await wait(() => {
        const rewardListButton = getByLabelText("input-reward-list-button");
        const penaltyListButton = getByLabelText("input-penalty-list-button");
        const upcomingTasksButton = getByLabelText("input-upcoming-tasks-button");
    });


    await teardown() 

    async function setup() {}

    async function teardown() {}
})
