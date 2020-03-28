
jest.mock("src/Models/Database");
jest.mock("src/Notification");
import Notification from "src/Notification";
import DB from "src/Models/Database";
import React from "react";

import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAll,
    createPenalties,
    createTasks,
    createGoals,
    createEarnedRewards,
    createEarnedPenalties,
    waitForAsyncLifecycleMethods,
} from "src/common/test-utils";
import MyDate from "src/common/Date";
import { renderWithNavigation } from "src/common/MockNavigation";
import { GoalLogic } from "src/Models/Goal/GoalQuery";
import StreakCycleQuery, { ChildStreakCycleQuery } from "src/Models/Group/StreakCycleQuery";


describe("habits", () => {
    afterEach(async() => {
        await destroyAll()
    })

    test("creation", async () => {
        const { 
            getByLabelText, queryAllByLabelText, queryByLabelText, 
            queryNavigation, navigation, component, 
            params, intake,
        } = renderWithNavigation("AppStart", {});
        intake( render(component()));
        await waitForAsyncLifecycleMethods()

        {   // Create a goal
            const addGoal = getByLabelText("input-add-habit")
            fireEvent.press(addGoal);
            intake( render(component()));
            await waitForAsyncLifecycleMethods()

            expect(queryNavigation.currentRoute).toEqual("AddGoal")
            getByLabelText("add-goal-screen");

            const summaryInput = getByLabelText("input-goal-summary");
            fireEvent.changeText(summaryInput, "Summary");

            const cycleInput = getByLabelText("input-goal-number-cycles");
            fireEvent.changeText(cycleInput, "2");

            await waitForAsyncLifecycleMethods()
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
            await waitForAsyncLifecycleMethods()
        }

        {   // After creating a streak goal, we should arrive at the created goal to do further work.
            intake(render(component()));
            await wait(() => {
                expect(queryNavigation.currentRoute).toEqual("Goal");
                getByLabelText("goal-screen");
            })

            //There shouldn't be any tasks, but there should be one cycle showing.
            await wait(() => {
                const tasks = queryAllByLabelText('task-list-item');
                expect(tasks.length).toEqual(0);
                const cycles = queryAllByLabelText('streakcycle-list-item');
                expect(cycles.length).toEqual(1);
            })

        }


    }, 10000)

    test("adding some tasks", async () => {

        const { getByLabelText, queryAllByLabelText, queryByLabelText, queryNavigation, navigation, component, params, intake } = renderWithNavigation("AppStart", {});
        intake( render(component()));

        {   // Create a goal
            const addGoal = getByLabelText("input-add-habit")
            fireEvent.press(addGoal);
            intake( render(component()));
            await waitForAsyncLifecycleMethods()

            const summaryInput = getByLabelText("input-goal-summary");
            fireEvent.changeText(summaryInput, "Summary");

            const cycleInput = getByLabelText("input-goal-number-cycles");
            fireEvent.changeText(cycleInput, "2");

            await waitForAsyncLifecycleMethods()
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
            await waitForAsyncLifecycleMethods()
        }

        {   // After creating a streak goal, we should arrive at the created goal.
            // Now we add a task.
            intake(render(component()));
            
            const addTaskButton = getByLabelText("input-add-goal-button");
            fireEvent.press(addTaskButton);
        }

        {   // We create a task
            intake(render(component()));
            await wait(() => {
                expect(queryNavigation.currentRoute).toEqual("AddTask");
                getByLabelText("add-task-screen");
            })

            const nameInput = getByLabelText("input-task-name");
            fireEvent.changeText(nameInput, "Name");

            await waitForAsyncLifecycleMethods();
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
            await waitForAsyncLifecycleMethods();
        }

        {   // after creating the task, we return to the goal, since we may want to add more tasks.
            intake(render(component()));
            await wait(() => {
                expect(queryNavigation.currentRoute).toEqual("Goal");
                getByLabelText("goal-screen");
            })

            //There should now be one task, and still one cycle
            await wait(() => {
                const tasks = queryAllByLabelText('task-list-item');
                expect(tasks.length).toEqual(1);
                const cycles = queryAllByLabelText('streakcycle-list-item');
                expect(cycles.length).toEqual(1);
            })
        }
    })

    test("Adding tasks and then waiting for one active cycle, and then one overdue cycle", async () => {

        const { getByLabelText, queryAllByLabelText, queryByLabelText, queryNavigation, navigation, component, params, intake,
        } = renderWithNavigation("AppStart", {});
        intake( render(component()));

        {   // Create a goal
            const addGoal = getByLabelText("input-add-habit")
            fireEvent.press(addGoal);
            intake( render(component()));
            await waitForAsyncLifecycleMethods();

            const summaryInput = getByLabelText("input-goal-summary");
            fireEvent.changeText(summaryInput, "Summary");

            const cycleInput = getByLabelText("input-goal-number-cycles");
            fireEvent.changeText(cycleInput, "2");

            await waitForAsyncLifecycleMethods()
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
            await waitForAsyncLifecycleMethods()
        }

        {   // After creating a streak goal, we should arrive at the created goal.
            // Now we add a task.
            intake(render(component()));
            
            const addTaskButton = getByLabelText("input-add-goal-button");
            fireEvent.press(addTaskButton);
            await waitForAsyncLifecycleMethods();
        }

        {   // We create a task
            intake(render(component()));
            await wait(() => {
                expect(queryNavigation.currentRoute).toEqual("AddTask");
                getByLabelText("add-task-screen");
            })

            const nameInput = getByLabelText("input-task-name");
            fireEvent.changeText(nameInput, "Name");

            await waitForAsyncLifecycleMethods();
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
            await waitForAsyncLifecycleMethods();
        }

        {   // after creating the task, we return to the goal, since we may want to add more tasks.
            intake(render(component()));
            await wait(() => {
                expect(queryNavigation.currentRoute).toEqual("Goal");
                getByLabelText("goal-screen");
            })

            // Now we simulate the passing of a day to generate a second cycle.
            const id = navigation.getParam("id", "");
            MyDate.TEST_ONLY_NowAdd(1, "days");
            await GoalLogic.processSomeStreaks(3);

            // Rerender screen, since we aren't going to wait for the refresh timer.
            intake(render(component()));
            await wait(async () => {
                expect(queryNavigation.currentRoute).toEqual("Goal");
                getByLabelText("goal-screen");
                let cycles = await new ChildStreakCycleQuery(id).all();
                expect(cycles.length).toEqual(2);
            })

            await wait(() => {
                const tasks = queryAllByLabelText('task-list-item');
                expect(tasks.length).toEqual(1);
                const cycles = queryAllByLabelText('streakcycle-list-item');
                expect(cycles.length).toEqual(2);
            })

            // Now we simulate the passing of a second day *PAST* the due date,
            // so no cycle should be generated.
            MyDate.TEST_ONLY_NowAdd(1, "days");
            await GoalLogic.processSomeStreaks(3);

            // Rerender screen, since we aren't going to wait for the refresh timer.
            intake(render(component()));
            await wait(async () => {
                expect(queryNavigation.currentRoute).toEqual("Goal");
                getByLabelText("goal-screen");
                let cycles = await new ChildStreakCycleQuery(id).all();
                expect(cycles.length).toEqual(2);
            })

            await wait(() => {
                const tasks = queryAllByLabelText('task-list-item');
                expect(tasks.length).toEqual(2); // 2 tasks. It should show all overdue tasks for this habit
                const cycles = queryAllByLabelText('streakcycle-list-item');
                expect(cycles.length).toEqual(2);
            })
        }
    }, 15000)

    test("Addings tasks on both the first and second day", async () => {
        const { getByLabelText, queryAllByLabelText, queryByLabelText, queryNavigation, navigation, component, params, intake,
        } = renderWithNavigation("AppStart", {});
        intake( render(component()));

        {   // Create a goal
            const addGoal = getByLabelText("input-add-habit")
            fireEvent.press(addGoal);
            intake( render(component()));
            await waitForAsyncLifecycleMethods();

            const summaryInput = getByLabelText("input-goal-summary");
            fireEvent.changeText(summaryInput, "Summary");

            const cycleInput = getByLabelText("input-goal-number-cycles");
            fireEvent.changeText(cycleInput, "2");

            await waitForAsyncLifecycleMethods()
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
            await waitForAsyncLifecycleMethods()
        }

        {   // After creating a streak goal, we should arrive at the created goal.
            // Now we add a task.
            intake(render(component()));
            
            const addTaskButton = getByLabelText("input-add-goal-button");
            fireEvent.press(addTaskButton);
            await waitForAsyncLifecycleMethods();
        }

        {   // We create a task
            intake(render(component()));
            await wait(() => {
                expect(queryNavigation.currentRoute).toEqual("AddTask");
                getByLabelText("add-task-screen");
            })

            const nameInput = getByLabelText("input-task-name");
            fireEvent.changeText(nameInput, "Name");

            await waitForAsyncLifecycleMethods();
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
            await waitForAsyncLifecycleMethods();
        }

        {   // after creating the task, we return to the goal, since we may want to add more tasks.
            intake(render(component()));
            await wait(() => {
                expect(queryNavigation.currentRoute).toEqual("Goal");
                getByLabelText("goal-screen");
            })

            // Now we simulate the passing of a day to generate a second cycle.
            const id = navigation.getParam("id", "");
            MyDate.TEST_ONLY_NowAdd(1, "days");
            await GoalLogic.processSomeStreaks(3);

            // Rerender screen, since we aren't going to wait for the refresh timer.
            intake(render(component()));
            await wait(async () => {
                expect(queryNavigation.currentRoute).toEqual("Goal");
                getByLabelText("goal-screen");
                let cycles = await new ChildStreakCycleQuery(id).all();
                expect(cycles.length).toEqual(2);
            })
        }

        { // Now we add a second task
            intake(render(component()));
            const addTaskButton = getByLabelText("input-add-goal-button");
            fireEvent.press(addTaskButton);
            await waitForAsyncLifecycleMethods();

            intake(render(component()));
            await wait(() => {
                expect(queryNavigation.currentRoute).toEqual("AddTask");
                getByLabelText("add-task-screen");
            })

            const nameInput = getByLabelText("input-task-name");
            fireEvent.changeText(nameInput, "Name");

            await waitForAsyncLifecycleMethods();
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
            await waitForAsyncLifecycleMethods();
        }

        { // We should see the second task reflected in the goal screen now.
            intake(render(component()));
            await wait(() => {
                expect(queryNavigation.currentRoute).toEqual("Goal");
                getByLabelText("goal-screen");
            })

            await wait(() => {
                const tasks = queryAllByLabelText('task-list-item');
                expect(tasks.length).toEqual(2);
                const cycles = queryAllByLabelText('streakcycle-list-item');
                expect(cycles.length).toEqual(2);
            })
        }
    }, 15000)
})




