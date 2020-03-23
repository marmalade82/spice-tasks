
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
        const { getByLabelText, queryNavigation, navigation, component, params, intake } = renderWithNavigation("AppStart", {});
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

        {   // After creating a goal, we should arrive at the created goal to do further work.
            intake(render(component()));
            await wait(() => {
                expect(queryNavigation.currentRoute).toEqual("Goal");
                getByLabelText("goal-screen");
            })
        }


    }, 10000)

    test("adding some tasks", async () => {

    })
})




