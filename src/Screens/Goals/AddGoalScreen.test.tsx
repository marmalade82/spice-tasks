
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";
import { fireEvent, render, wait, waitForElement } from '@testing-library/react-native';
import AddGoalScreen from "src/Screens/Goals/AddGoalScreen";
import { makeNavigation, destroyAllIn, createGoals } from "src/common/test-utils";
import GoalQuery from "src/Models/Goal/GoalQuery";


test('User view all desired initial fields for a normal goal', async () => {
    const { getByLabelText, queryByLabelText, getByText, queryByText } = render(<AddGoalScreen navigation={makeNavigation({})}></AddGoalScreen>)

    const summaryInput = getByLabelText("input-goal-summary");

    const typeInput = getByLabelText("input-goal-type");

    const dueDateInput = getByLabelText("modal-goal-start-date");

    const startDateInput = getByLabelText("modal-goal-due-date");

    const rewardInput = getByLabelText("input-goal-reward");

    const penaltyInput = getByLabelText("input-goal-penalty");

    const recurringInput = getByLabelText("modal-goal-recurring");
});

test('User can set type of goal to streak if desired', async () => {
    const { getByLabelText, queryByText, getByText } = render(<AddGoalScreen navigation={makeNavigation({})}></AddGoalScreen>)

    expect(queryByText("Minimum")).toEqual(null);
    const goalTypeInput = getByLabelText("input-goal-type");
    fireEvent.press(goalTypeInput);
    const goalChoice = getByLabelText("input-streak-goal-type");
    fireEvent.press(goalChoice);
    const minimumText = await waitForElement(() => getByText("Minimum"));
    const streakTypeInput = getByLabelText("input-streak-type");
    const streakDailyTimeInput = getByLabelText("modal-streak-time");

});

test("User can fill out all fields of a normal goal and have them saved to database after 'Complete'" +
                    "is clicked", async () => {
    const { getByLabelText, queryByLabelText, getByText, queryByText } = render(<AddGoalScreen navigation={makeNavigation({})}></AddGoalScreen>)

    const expected = {
        summary: "test summary",
        rewardType: "two_dice",
        type: "streak",
    }

    const summaryInput = getByLabelText("input-goal-summary");
    fireEvent.changeText(summaryInput, expected.summary);

    const typeInput = getByLabelText("input-goal-type");
    fireEvent.press(typeInput);
    const typeChoice = getByLabelText("input-" + expected.type + "-goal-type");
    fireEvent.press(typeChoice);

    const dueDateInput = getByLabelText("modal-goal-start-date");

    const startDateInput = getByLabelText("modal-goal-due-date");

    const rewardInput = getByLabelText("input-goal-reward");
    fireEvent.press(rewardInput);
    const rewardChoice = getByLabelText("input-" + expected.rewardType + "-goal-reward");
    fireEvent.press(rewardChoice);

    const penaltyInput = getByLabelText("input-goal-penalty");

    const recurringInput = getByLabelText("modal-goal-recurring");

    const saveButton = getByLabelText("input-save-button");
    fireEvent.press(saveButton);

    await wait(async () => {
        const createdGoals = (await new GoalQuery().all())
        const createdGoal = createdGoals[0];
        expect(createdGoals.length).toEqual(1)
        expect(createdGoal.title).toEqual(expected.summary);
        expect(createdGoal.rewardType).toEqual(expected.rewardType);
        expect(createdGoal.goalType).toEqual(expected.type);
    })

    await destroyAllIn('goals');
});
