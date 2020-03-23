
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
import { Test } from "src/Screens";


describe("Streak goals", () => {
    test("creation", async () => {
        const { getByLabelText, queryAllByLabelText, queryByLabelText, queryNavigation, navigation, component, params, intake } = renderWithNavigation("AppStart", {});
        intake( render(component()));

        {   // Create a goal
            const addGoal = getByLabelText("input-add-goal")
            fireEvent.press(addGoal);
            intake( render(component()));
            expect(queryNavigation.currentRoute).toEqual("AddGoal")
            getByLabelText("add-goal-screen");

            const summaryInput = getByLabelText("input-goal-summary");
            fireEvent.changeText(summaryInput, "Summary");

            const typeChoice = getByLabelText("input-" + "streak" + "-goal-type");
            fireEvent.press(typeChoice);

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
            const addGoal = getByLabelText("input-add-goal")
            fireEvent.press(addGoal);
            intake( render(component()));

            const summaryInput = getByLabelText("input-goal-summary");
            fireEvent.changeText(summaryInput, "Summary");

            const typeChoice = getByLabelText("input-" + "streak" + "-goal-type");
            fireEvent.press(typeChoice);

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

            //There should now be one task, and still one cycle
            await wait(() => {
                const tasks = queryAllByLabelText('task-list-item');
                expect(tasks.length).toEqual(1);
                const cycles = queryAllByLabelText('streakcycle-list-item');
                expect(cycles.length).toEqual(1);
            })
        }
    })
})




