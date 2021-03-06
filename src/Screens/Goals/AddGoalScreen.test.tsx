
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";
import { fireEvent, render, wait, waitForElement } from '@testing-library/react-native';
import AddGoalScreen from "src/Screens/Goals/AddGoalScreen";
import { makeNavigation, destroyAllIn, createGoals, waitForAsyncLifecycleMethods } from "src/common/test-utils";
import GoalQuery from "src/Models/Goal/GoalQuery";
import MyDate from "src/common/Date";
import { RewardTypes } from "src/Models/Reward/RewardLogic";
import { PenaltyTypes } from "src/Models/Penalty/PenaltyLogic";


test('User view all desired initial fields for a normal goal', async () => {
    const { getByLabelText, queryByLabelText, getByText, queryByText } = render(<AddGoalScreen navigation={makeNavigation({})}></AddGoalScreen>)

    const summaryInput = getByLabelText("input-goal-summary");

    const dueDateInput = getByLabelText("value-input-goal-start-date");

    const startDateInput = getByLabelText("value-input-goal-due-date");

    const rewardInput = getByLabelText("input-goal-reward");

    const penaltyInput = getByLabelText("input-goal-penalty");

});

test("User can fill out all fields of a normal goal and have them saved to database after 'Complete'" +
                    "is clicked", async () => {
    const navigation = makeNavigation({}, "a")
    const { getByLabelText, queryByLabelText, getByText, queryByText } = render(<AddGoalScreen navigation={navigation}></AddGoalScreen>)

    const expected = {
        summary: "test summary",
        rewardType: "none",
        type: "normal",
        details: "my-dets",
    }

    const summaryInput = getByLabelText("input-goal-summary");
    fireEvent.changeText(summaryInput, expected.summary);

    const detailsInput = getByLabelText("input-goal-details");
    fireEvent.changeText(detailsInput, expected.details);

    const dueDateInput = getByLabelText("value-input-goal-start-date");

    const startDateInput = getByLabelText("value-input-goal-due-date");

    const rewardInput = getByLabelText("input-goal-reward");
    fireEvent.press(rewardInput);
    const rewardChoice = getByLabelText("input-" + expected.rewardType + "-goal-reward");
    fireEvent.press(rewardChoice);

    const penaltyInput = getByLabelText("input-goal-penalty");

        {
            // render the save button, which shares an event dispatcher with the goal screen.
            const { getByLabelText } = render(AddGoalScreen.navigationOptions({ navigation: navigation}).right[0]())
            await waitForAsyncLifecycleMethods();
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
        }

    await wait(async () => {
        const createdGoals = (await new GoalQuery().all())
        const createdGoal = createdGoals[0];
        expect(createdGoals.length).toEqual(1)
        expect(createdGoal.title).toEqual(expected.summary);
        expect(createdGoal.rewardType).toEqual(expected.rewardType);
        expect(createdGoal.goalType).toEqual(expected.type);
        expect(createdGoal.details).toEqual(expected.details)
    })

    await destroyAllIn('goals');
});

test("User can fill out all fields of a streak goal and have them saved to database after 'Complete'" +
                    "is clicked", async () => {
    const navigation = makeNavigation({
        title: "Habit"
    }, "b")
    const { getByLabelText, queryByLabelText, getByText, queryByText } = render(<AddGoalScreen navigation={navigation}></AddGoalScreen>)

    await waitForAsyncLifecycleMethods();
    const expected = {
        summary: "test summary",
        rewardType: "none",
        type: "streak",
        details: "my-dets",
        streakType: "daily",
        streakMinimum: "3"
    }

    const summaryInput = getByLabelText("input-goal-summary");
    fireEvent.changeText(summaryInput, expected.summary);

    const detailsInput = getByLabelText("input-goal-details");
    fireEvent.changeText(detailsInput, expected.details);

    const rewardChoice = getByLabelText("input-" + expected.rewardType + "-goal-reward");
    fireEvent.press(rewardChoice);

    const streakTypeChoice = getByLabelText("input-" + expected.streakType + "-streak-type" )
    fireEvent.press(streakTypeChoice);

    const cycleInput = getByLabelText("input-goal-number-cycles");
    fireEvent.changeText(cycleInput, "2");

        {
            // render the save button, which shares an event dispatcher with the goal screen.
            const { getByLabelText } = render(AddGoalScreen.navigationOptions({ navigation: navigation}).right[0]())
            await waitForAsyncLifecycleMethods();
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
        }

    await wait(async () => {
        const createdGoals = (await new GoalQuery().all())
        const createdGoal = createdGoals[0];
        expect(createdGoals.length).toEqual(1)
        expect(createdGoal.title).toEqual(expected.summary);
        expect(createdGoal.goalType).toEqual(expected.type);
        expect(createdGoal.details).toEqual(expected.details)
        expect(createdGoal.streakType).toEqual(expected.streakType);
        new MyDate(createdGoal.dueDate).assertEquals(MyDate.Now().add(1, "days").asDueDate(), "same due date");
        new MyDate(createdGoal.startDate).assertEquals(MyDate.Now().asStartDate(), "same start date");
    })

    await destroyAllIn('goals');
}, 10000);

describe("Validation", () => {
    test("No summary is provided", async () => {
        const navigation = makeNavigation({}, "c")
        const { getByLabelText, queryByLabelText, getByText, queryByText } = 
                    render(<AddGoalScreen navigation={navigation}></AddGoalScreen>)
        const toast = queryByLabelText('toast');
        expect(toast).toEqual(null);

        {
            // render the save button, which shares an event dispatcher with the goal screen.
            const { getByLabelText } = render(AddGoalScreen.navigationOptions({ navigation: navigation}).right[0]())
            await waitForAsyncLifecycleMethods();
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
        }

        await wait(async () => {
            const toast = getByLabelText("toast");
            const createdGoals = (await new GoalQuery().all())
            expect(createdGoals.length).toEqual(0);
        })
    }, 10000)

    test("Start date is after due date", async () => {
        const navigation = makeNavigation({}, "d")
        const { getByLabelText, queryByLabelText, getByText, queryByText } = 
                    render(<AddGoalScreen navigation={navigation}></AddGoalScreen>)
        const toast = queryByLabelText('toast');
        expect(toast).toEqual(null);

        const summaryInput = getByLabelText("input-goal-summary");
        fireEvent.changeText(summaryInput, "Dummy value");

        const dueInput = getByLabelText("value-input-goal-due-date");
        fireEvent.changeText(dueInput, MyDate.Now().toDate().toString());

        const startInput = getByLabelText("value-input-goal-start-date");
        fireEvent.changeText(startInput, MyDate.Now().add(1, "days").toDate().toString());

        {
            // render the save button, which shares an event dispatcher with the goal screen.
            const { getByLabelText } = render(AddGoalScreen.navigationOptions({ navigation: navigation}).right[0]())
            await waitForAsyncLifecycleMethods();
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
        }

        await wait(async () => {
            const toast = getByLabelText("toast");
            const createdGoals = (await new GoalQuery().all())
            expect(createdGoals.length).toEqual(0);
        })
    }, 20000)

    test("User must choose a specific reward", async () => {
        const navigation = makeNavigation({}, "e")
        const { getByLabelText, queryByLabelText, getByText, queryByText } = 
                    render(<AddGoalScreen navigation={navigation}></AddGoalScreen>)
        const toast = queryByLabelText('toast');
        expect(toast).toEqual(null);

        const summaryInput = getByLabelText("input-goal-summary");
        fireEvent.changeText(summaryInput, "Dummy value");

        const rewardChoice = getByLabelText("input-" + RewardTypes.SPECIFIC + "-goal-reward");
        fireEvent.press(rewardChoice);

        {
            // render the save button, which shares an event dispatcher with the goal screen.
            const { getByLabelText } = render(AddGoalScreen.navigationOptions({ navigation: navigation}).right[0]())
            await waitForAsyncLifecycleMethods();
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
        }

        await wait(async () => {
            const toast = getByLabelText("toast");
        })
    }, 20000)

    test("User must choose a specific penalty", async () => {
        const navigation = makeNavigation({}, "f")
        const { getByLabelText, queryByLabelText, getByText, queryByText } = 
                    render(
                            <AddGoalScreen navigation={navigation}></AddGoalScreen>
                    );
                    
        const toast = queryByLabelText('toast');
        expect(toast).toEqual(null);

        const summaryInput = getByLabelText("input-goal-summary");
        fireEvent.changeText(summaryInput, "Dummy value");

        const rewardChoice = getByLabelText("input-" + RewardTypes.NONE + "-goal-reward");
        fireEvent.press(rewardChoice);

        const penaltyChoice = getByLabelText("input-" + PenaltyTypes.SPECIFIC + "-goal-penalty");
        fireEvent.press(penaltyChoice);

        {
            // render the save button, which shares an event dispatcher with the goal screen.
            const { getByLabelText } = render(AddGoalScreen.navigationOptions({ navigation: navigation}).right[0]())
            await waitForAsyncLifecycleMethods();
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
        }

        await wait(async () => {
            const toast = getByLabelText("toast");
        })
    }, 20000)

    test("start date cannot be in past", async () => {
        const navigation = makeNavigation({}, "d")
        const { getByLabelText, queryByLabelText, getByText, queryByText } = 
                    render(<AddGoalScreen navigation={navigation}></AddGoalScreen>)
        const toast = queryByLabelText('toast');
        expect(toast).toEqual(null);

        const summaryInput = getByLabelText("input-goal-summary");
        fireEvent.changeText(summaryInput, "Dummy value");

        const startInput = getByLabelText("value-input-goal-start-date");
        fireEvent.changeText(startInput, MyDate.Now().subtract(1, "days").toDate().toString());

        {
            // render the save button, which shares an event dispatcher with the goal screen.
            const { getByLabelText } = render(AddGoalScreen.navigationOptions({ navigation: navigation}).right[0]())
            await waitForAsyncLifecycleMethods();
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
        }

        await wait(async () => {
            const toast = getByLabelText("toast");
            const createdGoals = (await new GoalQuery().all())
            expect(createdGoals.length).toEqual(0);
        })
    }, 10000)
})