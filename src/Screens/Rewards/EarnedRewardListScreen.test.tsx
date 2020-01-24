jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";

import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAllIn,
    createGoals, createTasks, createEarnedRewards,
} from "src/common/test-utils";
import MyDate from "src/common/Date";
import EarnedRewardSchema from "src/Models/Reward/EarnedRewardSchema";

import EarnedRewardListScreen from "src/Screens/Rewards/EarnedRewardListScreen";



test("User can view all earned rewards present", async () => {
    await setup();

    const { queryAllByLabelText } = render(<EarnedRewardListScreen navigation={makeNavigation({})}></EarnedRewardListScreen>)

    await wait(() => {
        const earned = queryAllByLabelText("earned-reward-list-item");
        expect(earned.length).toEqual(4);
    });


    await teardown();

    async function setup() {
        await DB.get().action(async () => {
            await createEarnedRewards({
                earnedDate: new MyDate().toDate(),
                active: true,
                type: "two_dice",
            }, 4);
        })
    }

    async function teardown() {
        await destroyAllIn(EarnedRewardSchema.table);
    }
}, 10000)