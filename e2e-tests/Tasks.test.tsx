
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


describe("simple tasks", () => {
    test("creation", async () => {
        const { 
            getByLabelText, queryAllByLabelText, queryByLabelText, getByText,
            queryNavigation, navigation, component, 
            params, intake,
        } = renderWithNavigation("AppStart", {});

        {
            intake( render(component()));
            const addTask = getByLabelText("input-add-task")
            fireEvent.press(addTask);
        }

        {   // add task
            intake( render(component()));
            await wait(() => {
                expect(queryNavigation.currentRoute).toEqual("AddTask");
                getByLabelText("add-task-screen");
            })

            const nameInput = getByLabelText("input-task-name");
            fireEvent.changeText(nameInput, "Name");

            await waitForAsyncLifecycleMethods(2000);
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
            await waitForAsyncLifecycleMethods();
        }

        {   // After creating task, we return to previous screen, since most tasks don't usually
            // come with subtasks
            intake(render(component()));
            await wait(() => {
                expect(queryNavigation.currentRoute).toEqual("AppStart");
                getByLabelText("app-start-screen");
            })

            // We should see a task due today, since that is the default in task creation

        }
    }, 10000)
})

