
import React from "react";
import { fireEvent, render, wait, waitForElement } from '@testing-library/react-native';
import AddGoalScreen from "src/Screens/Goals/AddGoalScreen";
import { navigation } from "src/common/test-utils";


test('User can fill out form as a normal goal', async () => {
    const { getByLabelText, queryByLabelText, getByText, queryByText } = render(<AddGoalScreen navigation={navigation}></AddGoalScreen>)

    const summaryInput = getByLabelText("input-goal-summary");

    const typeInput = getByLabelText("input-goal-type");

    const dueDateInput = getByLabelText("modal-goal-start-date");

    const startDateInput = getByLabelText("modal-goal-due-date");

    const rewardInput = getByLabelText("input-goal-reward");

    const penaltyInput = getByLabelText("input-goal-penalty");

    const recurringInput = getByLabelText("modal-goal-recurring");
});

test('User can set type of goal to streak if desired', async () => {
    const { getByLabelText, queryByText, getByText } = render(<AddGoalScreen navigation={navigation}></AddGoalScreen>)

    expect(queryByText("Minimum")).toEqual(null);
    const goalTypeInput = getByLabelText("input-goal-type");
    fireEvent.valueChange(goalTypeInput, "streak" );
    const minimumText = await waitForElement(() => getByText("Minimum"));
    const streakTypeInput = getByLabelText("input-streak-type");
    const streakDailyTimeInput = getByLabelText("modal-streak-time");

});