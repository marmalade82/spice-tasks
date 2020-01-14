
import React from "react";
import { fireEvent, render, wait, waitForElement } from '@testing-library/react-native';
import AddGoalScreen from "src/Screens/Goals/AddGoalScreen";
import { navigation } from "src/common/test-utils";


test('User can fill out form as a normal goal', async () => {
    const { getByLabelText, getByText } = render(<AddGoalScreen navigation={navigation}></AddGoalScreen>)

    const summaryInput = getByLabelText("input-goal-summary");
});

test('User can set type of goal to streak if desired', async () => {
    const { getByLabelText, getByText } = render(<AddGoalScreen navigation={navigation}></AddGoalScreen>)

    expect(() => {getByText("Minimum")}).toThrow(); // this should use queryByText instead so we don't check for throwing
    const typeInput = getByLabelText("input-goal-type");
    fireEvent.valueChange(typeInput, "streak" );
    const minimumNode = await waitForElement(() => getByText("Minimum"));
});