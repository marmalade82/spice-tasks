
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";
import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { Goal, GoalQuery, IGoal } from "src/Models/Goal/GoalQuery";
import { TaskQuery, Task, ITask } from "src/Models/Task/TaskQuery";
import GoalScreen from "src/Screens/Goals/GoalScreen";
import { makeNavigation, destroyAllIn } from "src/common/test-utils";

afterEach(cleanup)

test("User has access to the complete button", async() => {
    const { getByLabelText, queryByLabelText, getByText, queryByText } = render(
        <GoalScreen navigation={makeNavigation({})}></GoalScreen>
    )
    const completeButton = getByLabelText("input-goal-complete-button");
});

test("By pressing Complete button, user can mark the goal and its tasks as Complete in the database", async () => {
    const opts = await setup();

    let activeGoals: Goal[] = await new GoalQuery().activeGoals();
    expect(activeGoals.length).toEqual(1);
    let activeTasks: Task[] = await new TaskQuery().activeTasks();
    expect(activeTasks.length).toEqual(1);

    {
        const { getByLabelText } = render(
            <GoalScreen navigation={makeNavigation({id: opts.parentId})}></GoalScreen>
        );
        const completeButton = getByLabelText("input-goal-complete-button");
        fireEvent.press(completeButton);
    } 

    await wait(async() => {
        const completedGoals: Goal[] = await new GoalQuery().completedGoals();
        expect(completedGoals.length).toEqual(1);
        const inactiveGoals: Goal[] = await new GoalQuery().inactiveGoals();
        expect(inactiveGoals.length).toEqual(1);
        activeGoals = await new GoalQuery().activeGoals();
        expect(activeGoals.length).toEqual(0);
    })

    await wait(async() => {
        const completedTasks: Task[] = await new TaskQuery().completedTasks();
        expect(completedTasks.length).toEqual(1);
        const inactiveTasks: Task[] = await new TaskQuery().inactiveTasks();
        expect(inactiveTasks.length).toEqual(1);
        activeTasks = await new TaskQuery().activeTasks();
        expect(activeTasks.length).toEqual(0);
    })

    await teardown();


    async function setup() {
        const opts = {
            parentId: ""
        }
        await DB.get().action(async () => {
            const parent = await DB.get().collections.get("goals").create((goal: Goal) => {
                goal.active = true;
                goal.title = "Parent";
                goal.state = "open"
            });

            opts.parentId = parent.id;
            const child = await DB.get().collections.get("tasks").create((task: Task) => {
                task.parentId = parent.id;
                task.active = true;
                task.title = "Child";
                task.state = "open"
            });
        });

        return opts;
    }

    async function teardown() {
        await destroyAllIn("goals");
    }
}, 20000)