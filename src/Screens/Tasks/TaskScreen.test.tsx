import React from "react";
import { fireEvent, render, wait, waitForElement } from '@testing-library/react-native';
import { navigation } from "src/common/test-utils";
import TaskScreen from "src/Screens/Tasks/TaskScreen";
import DB from "src/Models/__mocks__/Database";

jest.mock("src/Models/Database");

/**
 * Initializes the database with some basic data
 */
function setup() {

}

/**
 * Clears the database so the next test can use it properly.
 */
function teardown() {
    /*
    Can't use clearDB just yet because it's not safe to use. Instead need to manually iterate through all db records to delete each.
    DB.clearDB();
    */
}


test("User has access to the complete button", async() => {
    const { getByLabelText, queryByLabelText, getByText, queryByText } = render(<TaskScreen navigation={navigation}></TaskScreen>)
    const completeButton = getByLabelText("button-task-complete");
});