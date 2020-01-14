import React from "react";
import { fireEvent, render, wait, waitForElement } from '@testing-library/react-native';
import { navigation } from "src/common/test-utils";
import TaskScreen from "src/Screens/Tasks/TaskScreen";

jest.mock("src/Models/Database");


test("User has access to the complete button", async() => {
    const { getByLabelText, queryByLabelText, getByText, queryByText } = render(<TaskScreen navigation={navigation}></TaskScreen>)
    /*const completeButton = getByLabelText("button-task-complete");*/
});