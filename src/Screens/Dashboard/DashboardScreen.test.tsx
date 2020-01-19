
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

describe("first view", async () => {
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

    test.skip("User can see all active goals due today, along with any active due/overdue child tasks", async () => {
        await setup();

        const { queryAllByLabelText } = render(
            <DashboardScreen navigation={makeNavigation({})}></DashboardScreen>
        );

        {
            await wait(() => {
                const dueGoals = queryAllByLabelText("goal-list-item");
                expect(dueGoals.length).toEqual(1);

                const childTasks = queryAllByLabelText("child-task-list-item");
                expect(childTasks.length).toEqual(3)
            });
        }

        await teardown();
        
        async function setup() {
            await DB.get().action(async () => {
                const dueGoal = await createGoals({
                    active: true,
                    title: "Due goal",
                    dueDate: new MyDate().prevMidnight().add(1, "hours").toDate(),
                }, 1)[0];

                await createTasks({
                    parentId: dueGoal.id,
                    active: true,
                    title: "Overdue child",
                    dueDate: new MyDate().subtract(1, "days").toDate()
                }, 1);

                await createTasks({
                    parentId: dueGoal.id,
                    active: true,
                    title: "Due child",
                    dueDate: new MyDate().prevMidnight().add(1, "minutes").toDate(),
                }, 2);

                const overdueGoal = await createGoals({
                    active: true,
                    dueDate: new MyDate().subtract(1, "days").toDate()
                }, 1)
            })
        }

        async function teardown() {
            await destroyAllIn('goals');
            await destroyAllIn('tasks');
        }
    });
});



test("User can switch views to Third View and see a list of other less-commonly-used options", async () => {
    await setup()

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
                title: "Inactive"
            }, 2);
        });
    }

    async function teardown() {
        await destroyAllIn('tasks');
    }
});