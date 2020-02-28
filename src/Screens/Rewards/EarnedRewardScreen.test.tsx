
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";

import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAll,
    createGoals, createTasks, createEarnedRewards,
    createRewards,
    createPenalties,
} from "src/common/test-utils";
import EarnedRewardScreen from "src/Screens/Rewards/EarnedRewardScreen";
import { RewardTypes } from "src/Models/Reward/RewardLogic";
import MyDate from "src/common/Date";
import ClaimedRewardQuery from "src/Models/Reward/ClaimedRewardQuery";

test.skip("User can view the summary of the earned reward", async() => {
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
                type: RewardTypes.TWO_DICE,
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

describe.skip("Earned reward is two dice", () => {
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
                    type: RewardTypes.TWO_DICE,
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

    test("User can click button to roll dice and claim reward or penalty, which " +
        "generates a claimed reward", async () => {
        const { id } = await setup();

        const { getByLabelText, queryAllByLabelText } = render(
            <EarnedRewardScreen navigation={makeNavigation({ id: id})}>
            </EarnedRewardScreen>
        );
        await wait(async () => {
            const summary = getByLabelText("two-dice-wizard");
        })
        const inputClaim = getByLabelText("input-claim-button");
        fireEvent.press(inputClaim);
        debugger;
        await wait(async () => {
            const claimedList = await new ClaimedRewardQuery().all();
            expect(claimedList.length).toEqual(1);

            const claimed = claimedList[0];
            expect(claimed.title === "Reward 1" || claimed.title === "Penalty 1").toEqual(true);
            expect(claimed.details === "Reward" || claimed.details === "Penalty").toEqual(true);
        }, {
            timeout: 10000
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
                    type: RewardTypes.TWO_DICE,
                    earnedDate: new MyDate().subtract(1, "days").toDate(),
                }, 1))[0];

                opts.id = earned.id;

                const rewards = (await createRewards({
                    title: "Reward 1",
                    details: "Reward",
                }, 1));

                const penalties = (await createPenalties({
                    title: "Penalty 1",
                    details: "Penalty",
                }, 1));
            });

            return opts;
        }

        async function teardown() {
            await destroyAll();
        }
    }, 20000)
});
