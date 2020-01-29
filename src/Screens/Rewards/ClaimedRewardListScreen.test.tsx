
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";

import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAll,
    createGoals, createTasks, createClaimedRewards,
} from "src/common/test-utils";
import MyDate from "src/common/Date";
import ClaimedRewardSchema from "src/Models/Reward/ClaimedRewardSchema";

import ClaimedRewardListScreen from "src/Screens/Rewards/ClaimedRewardListScreen";
import { Rewards } from "src/Models/Reward/RewardLogic";



test("User can view all claimed penalties present", async () => {
    await setup();

    const { queryAllByLabelText } = render(<ClaimedRewardListScreen navigation={makeNavigation({})}></ClaimedRewardListScreen>)

    await wait(() => {
        const claimed = queryAllByLabelText("claimed-reward-list-item");
        expect(claimed.length).toEqual(4);
    });


    await teardown();

    async function setup() {
        await DB.get().action(async () => {
            await createClaimedRewards({
                claimedDate: new MyDate().toDate(),
                type: "penalty",
            }, 4);
        })
    }

    async function teardown() {
        await destroyAll()
    }
}, 10000)

test("User can view all claimed rewards present", async () => {
    await setup();

    const { queryAllByLabelText } = render(<ClaimedRewardListScreen navigation={makeNavigation({})}></ClaimedRewardListScreen>)

    await wait(() => {
        const claimed = queryAllByLabelText("claimed-reward-list-item");
        expect(claimed.length).toEqual(4);
    });


    await teardown();

    async function setup() {
        await DB.get().action(async () => {
            await createClaimedRewards({
                claimedDate: new MyDate().toDate(),
                type: "reward",
            }, 4);
        })
    }

    async function teardown() {
        await destroyAll()
    }
}, 10000)