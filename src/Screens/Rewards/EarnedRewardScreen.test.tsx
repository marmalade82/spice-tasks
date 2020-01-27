
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";

import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAll,
    createGoals, createTasks, createEarnedRewards,
} from "src/common/test-utils";
import EarnedRewardScreen from "src/Screens/Rewards/EarnedRewardScreen";
import { Rewards } from "src/Models/Reward/RewardLogic";
import MyDate from "src/common/Date";

test("User can view the summary of the earned reward", async() => {
    const { id } = await setup();

    const { getByLabelText, queryAllByLabelText } = render(
        <EarnedRewardScreen navigation={makeNavigation({ id: id})}>
        </EarnedRewardScreen>
    );

    await wait(() => {
        const summary = getByLabelText("earned-reward-summary");

        const type = getByLabelText("earned-reward-type");

        const icon = getByLabelText("earned-reward-icon");

        const earnedDate = getByLabelText("earned-reward-earned-date")

        const goal = getByLabelText("earned-reward-goal");
    })

    await teardown();

    async function setup() {
        const opts = {
            id: ""
        };
        await DB.get().action(async () => {
            const goal = (await createGoals({
                active: false,
                title: "source goal",
            }, 1))[0];

            const earned = (await createEarnedRewards({
                goalId: goal.id,
                type: Rewards.TWO_DICE,
                earnedDate: new MyDate().add(1, "days").toDate(),
            }, 1))[0];

            opts.id = earned.id;
        });

        return opts;
    }

    async function teardown() {
        await destroyAll();
    }
});

test("If earned reward is for two dice, user can see claiming wizard for two dice", async () => {
    const { id } = await setup();

    const { getByLabelText, queryAllByLabelText } = render(
        <EarnedRewardScreen navigation={makeNavigation({ id: id})}>
        </EarnedRewardScreen>
    );
    await wait(() => {
        const summary = getByLabelText("two-dice-wizard");
    })

    await teardown();

    async function setup() {
        const opts = {
            id: ""
        };
        await DB.get().action(async () => {
            const goal = (await createGoals({
                active: false,
                title: "source goal",
            }, 1))[0];

            const earned = (await createEarnedRewards({
                goalId: goal.id,
                type: Rewards.TWO_DICE,
                earnedDate: new MyDate().add(1, "days").toDate(),
            }, 1))[0];

            opts.id = earned.id;
        });

        return opts;
    }

    async function teardown() {
        await destroyAll();
    }
});