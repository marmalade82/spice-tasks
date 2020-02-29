
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";
import { fireEvent, render, wait, waitForElement } from '@testing-library/react-native';
import AddTaskScreen from "src/Screens/Tasks/AddTaskScreen";
import { makeNavigation, destroyAllIn, createTasks } from "src/common/test-utils";
import TaskQuery from "src/Models/Task/TaskQuery";
import MyDate from "src/common/Date";

describe("Validation", () => {
    test("Summary is required", async () => {
        const { getByLabelText, queryByLabelText, getByText, queryByText } = 
                    render(<AddTaskScreen navigation={makeNavigation({})}></AddTaskScreen>)
        const toast = queryByLabelText('toast');
        expect(toast).toEqual(null);

        const saveButton = getByLabelText("input-save-button");
        fireEvent.press(saveButton);

        await wait(async () => {
            const toast = getByLabelText("toast");
        })
    })

    test("Start date is after due date", async () => {
        const { getByLabelText, queryByLabelText, getByText, queryByText } = 
                    render(<AddTaskScreen navigation={makeNavigation({})}></AddTaskScreen>)
        const toast = queryByLabelText('toast');
        expect(toast).toEqual(null);

        const nameInput = getByLabelText("input-task-name");
        fireEvent.changeText(nameInput, "Dummy value");

        const dueInput = getByLabelText("value-input-task-due-date");
        fireEvent.changeText(dueInput, new MyDate().toDate().toString());

        const startInput = getByLabelText("value-input-task-start-date");
        fireEvent.changeText(startInput, new MyDate().add(1, "days").toDate().toString());

        const saveButton = getByLabelText("input-save-button");
        fireEvent.press(saveButton);

        await wait(async () => {
            const toast = getByLabelText("toast");
        })
    }, 20000)
});