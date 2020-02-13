
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";
import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { Goal, GoalQuery, IGoal } from "src/Models/Goal/GoalQuery";
import { TaskQuery, Task, ITask } from "src/Models/Task/TaskQuery";
import GoalScreen from "src/Screens/Goals/GoalScreen";
import { 
    makeNavigation, destroyAllIn, destroyAll,
    createGoals, createTasks,
} from "src/common/test-utils";
import EarnedRewardSchema from "src/Models/Reward/EarnedRewardSchema";
import { Rewards } from "src/Models/Reward/RewardLogic";
import EarnedRewardQuery from "src/Models/Reward/EarnedRewardQuery";
import { GoalType } from "src/Models/Goal/GoalLogic";

afterEach(cleanup)

describe("Using the complete button", () => {

    test("By pressing Complete button, user can mark the goal and its tasks as Complete in the database", async () => {
        const opts = await setup();

        let activeGoals: Goal[] = await new GoalQuery().activeGoals();
        expect(activeGoals.length).toEqual(1);
        let activeTasks: Task[] = await new TaskQuery().activeTasks();
        expect(activeTasks.length).toEqual(1);

        {
            const { getByLabelText } = render(
                <GoalScreen navigation={makeNavigation({id: opts.parentId})}></GoalScreen>
            );

            await wait(async () => {
                const completeButton = getByLabelText("input-goal-complete-button");
                fireEvent.press(completeButton);
            })
        } 

        await wait(async() => {
            const completedGoals: Goal[] = await new GoalQuery().completedGoals();
            expect(completedGoals.length).toEqual(1);
            const inactiveGoals: Goal[] = await new GoalQuery().inactiveGoals();
            expect(inactiveGoals.length).toEqual(1);
            activeGoals = await new GoalQuery().activeGoals();
            expect(activeGoals.length).toEqual(0);
        })

        await wait(async() => {
            const completedTasks: Task[] = await new TaskQuery().completedTasks();
            expect(completedTasks.length).toEqual(1);
            const inactiveTasks: Task[] = await new TaskQuery().inactiveTasks();
            expect(inactiveTasks.length).toEqual(1);
            activeTasks = await new TaskQuery().activeTasks();
            expect(activeTasks.length).toEqual(0);
        })

        await teardown();


        async function setup() {
            const opts = {
                parentId: ""
            }
            await DB.get().action(async () => {
                const parent = await DB.get().collections.get("goals").create((goal: Goal) => {
                    goal.active = true;
                    goal.title = "Parent";
                    goal.state = "open"
                });

                opts.parentId = parent.id;
                const child = await DB.get().collections.get("tasks").create((task: Task) => {
                    task.parentId = parent.id;
                    task.active = true;
                    task.title = "Child";
                    task.state = "open"
                });
            });

            return opts;
        }

        async function teardown() {
            await destroyAllIn("goals");
            await destroyAllIn(EarnedRewardSchema.table);
        }
    }, 20000)

    test("If user completes a goal with a reward type of 'Two Dice', an earned reward with type " + 
        "Two Dice is generated in the database", async () => {
        const { id } = await setup();

        const { getByLabelText, queryByLabelText } = render(
            <GoalScreen navigation={makeNavigation({ id: id})}>
            </GoalScreen>
        );

        await wait(async () => {
            const moreButton = getByLabelText("input-goal-more-button");
            fireEvent.press(moreButton);
        })

        await wait(async () => {
            const completeButton = getByLabelText("input-goal-complete-button");
            fireEvent.press(completeButton);
        })

        await wait(async () => {
            const earned = await new EarnedRewardQuery().all();
            expect(earned.length).toEqual(1);
            expect(earned[0].type).toEqual(Rewards.TWO_DICE);
        });
        
        await teardown(); 

        async function setup() {
            const opts = {
                id: ""
            };
            await DB.get().action(async () => {
                const goal = (await createGoals({
                    active: true,
                    title: "Test goal",
                    rewardType: Rewards.TWO_DICE,
                }, 1))[0];
                opts.id = goal.id;
            });

            return opts;
        }

        async function teardown() {
            await destroyAllIn('goals');
            await destroyAllIn(EarnedRewardSchema.table);
        }

    })

    test("If user completes a goal with a reward type of 'Spin the Wheel', an earned reward is generated " + 
        "", async () => {
        const { id } = await setup();

        const { getByLabelText, queryByLabelText } = render(
            <GoalScreen navigation={makeNavigation({ id: id})}>
            </GoalScreen>
        );

        await wait(async () => {
            const moreButton = getByLabelText("input-goal-more-button");
            fireEvent.press(moreButton);
        })

        await wait(async () => {
            const completeButton = getByLabelText("input-goal-complete-button");
            fireEvent.press(completeButton);
        })

        await wait(async () => {
            const earned = await new EarnedRewardQuery().all();
            expect(earned.length).toEqual(1);
        });
        
        await teardown(); 

        async function setup() {
            const opts = {
                id: ""
            };
            await DB.get().action(async () => {
                const goal = (await createGoals({
                    active: true,
                    title: "Test goal",
                    rewardType: Rewards.WHEEL,
                }, 1))[0];
                opts.id = goal.id;
            });

            return opts;
        }

        async function teardown() {
            await destroyAll();
        }
    })
    test("If user completes a goal with a reward type of 'Coin Flip', an earned reward is generated " + 
        "", async () => {
        const { id } = await setup();

        const { getByLabelText, queryByLabelText } = render(
            <GoalScreen navigation={makeNavigation({ id: id})}>
            </GoalScreen>
        );

        await wait(async () => {
            const moreButton = getByLabelText("input-goal-more-button");
            fireEvent.press(moreButton);
        })

        await wait(async () => {
            const completeButton = getByLabelText("input-goal-complete-button");
            fireEvent.press(completeButton);
        })

        await wait(async () => {
            const earned = await new EarnedRewardQuery().all();
            expect(earned.length).toEqual(1);
        });
        
        await teardown(); 

        async function setup() {
            const opts = {
                id: ""
            };
            await DB.get().action(async () => {
                const goal = (await createGoals({
                    active: true,
                    title: "Test goal",
                    rewardType: Rewards.COIN_FLIP,
                }, 1))[0];
                opts.id = goal.id;
            });

            return opts;
        }

        async function teardown() {
            await destroyAll();
        }
    })

    test("If user completes a goal with a reward type of 'Lootbox', an earned reward is generated " + 
        "", async () => {
        const { id } = await setup();

        const { getByLabelText, queryByLabelText } = render(
            <GoalScreen navigation={makeNavigation({ id: id})}>
            </GoalScreen>
        );

        await wait(async () => {
            const moreButton = getByLabelText("input-goal-more-button");
            fireEvent.press(moreButton);
        })

        await wait(async () => {
            const completeButton = getByLabelText("input-goal-complete-button");
            fireEvent.press(completeButton);
        })

        await wait(async () => {
            const earned = await new EarnedRewardQuery().all();
            expect(earned.length).toEqual(1);
        });
        
        await teardown(); 

        async function setup() {
            const opts = {
                id: ""
            };
            await DB.get().action(async () => {
                const goal = (await createGoals({
                    active: true,
                    title: "Test goal",
                    rewardType: Rewards.LOOTBOX,
                }, 1))[0];
                opts.id = goal.id;
            });

            return opts;
        }

        async function teardown() {
            await destroyAll();
        }
    })
    test("If user completes a goal with a reward type of 'Specific', an earned reward is generated " + 
        "", async () => {
        const { id } = await setup();

        const { getByLabelText, queryByLabelText } = render(
            <GoalScreen navigation={makeNavigation({ id: id})}>
            </GoalScreen>
        );

        await wait(async () => {
            const moreButton = getByLabelText("input-goal-more-button");
            fireEvent.press(moreButton);
        })

        await wait(async () => {
            const completeButton = getByLabelText("input-goal-complete-button");
            fireEvent.press(completeButton);
        })

        await wait(async () => {
            const earned = await new EarnedRewardQuery().all();
            expect(earned.length).toEqual(1);
        });
        
        await teardown(); 

        async function setup() {
            const opts = {
                id: ""
            };
            await DB.get().action(async () => {
                const goal = (await createGoals({
                    active: true,
                    title: "Test goal",
                    rewardType: Rewards.SPECIFIC,
                }, 1))[0];
                opts.id = goal.id;
            });

            return opts;
        }

        async function teardown() {
            await destroyAll();
        }
    })

    test("If user completes a goal with a reward type of 'None', no earned reward is generated " + 
        "", async () => {
        const { id } = await setup();

        const { getByLabelText, queryByLabelText } = render(
            <GoalScreen navigation={makeNavigation({ id: id})}>
            </GoalScreen>
        );

        await wait(async () => {
            const moreButton = getByLabelText("input-goal-more-button");
            fireEvent.press(moreButton);
        })

        await wait(async () => {
            const completeButton = getByLabelText("input-goal-complete-button");
            fireEvent.press(completeButton);
        })

        await wait(async () => {
            const earned = await new EarnedRewardQuery().all();
            expect(earned.length).toEqual(0);
        });
        
        await teardown(); 

        async function setup() {
            const opts = {
                id: ""
            };
            await DB.get().action(async () => {
                const goal = (await createGoals({
                    active: true,
                    title: "Test goal",
                    rewardType: Rewards.NONE,
                }, 1))[0];
                opts.id = goal.id;
            });

            return opts;
        }

        async function teardown() {
            await destroyAll();
        }
    })
});

test("User can view active and inactive tasks", async () => {
    const opts = await setup()

    const { getByLabelText, queryAllByLabelText } = render(
        <GoalScreen
            navigation={makeNavigation({id: opts.parentId})}
        ></GoalScreen>
    );

    {
        await wait(() => {
            const active = queryAllByLabelText("task-list-item");
            expect(active.length).toEqual(3);
        })
    }

    {
        const viewTwo = getByLabelText("input-view-2");
        fireEvent.press(viewTwo);
        await wait(() => {
            const inactive = queryAllByLabelText("task-list-item");
            expect(inactive.length).toEqual(2);
        })
    }

    {
        const viewOne = getByLabelText("input-view-1");
        fireEvent.press(viewOne);
        await wait(() => {
            const active = queryAllByLabelText("task-list-item");
            expect(active.length).toEqual(3);
        });
    }

    await teardown()

    async function setup() {
        const opts = {
            parentId: ""
        }

        await DB.get().action(async () => {
            const parent = (await createGoals({
                active: true,
                title: "Parent",
                state: "open",
            }, 1))[0];

            opts.parentId = parent.id;

            const activeChildren = await createTasks({
                parentId: parent.id,
                active: true,
                title: "Active Child",
                state: "open",
            }, 3);

            const inactiveChildren = await createTasks({
                parentId: parent.id,
                active: false,
                title: "Inactive Child",
                state: "open",
            }, 2);
        });

        return opts
    }

    async function teardown() {
        await destroyAllIn('tasks');
        await destroyAllIn('goals');
    }
}, 20000)


test("User can mark a goal as incomplete, which marks the goal and descendant tasks/goals " + 
    " as incomplete as well", async () => {

    const opts = await setup();

    let activeGoals: Goal[] = await new GoalQuery().activeGoals();
    expect(activeGoals.length).toEqual(1);
    let activeTasks: Task[] = await new TaskQuery().activeTasks();
    expect(activeTasks.length).toEqual(1);

    {
        const { getByLabelText } = render(
            <GoalScreen navigation={makeNavigation({id: opts.parentId})}></GoalScreen>
        );

        await wait(async () => {
            const completeButton = getByLabelText("input-goal-incomplete-button");
            fireEvent.press(completeButton);
        })
    } 

    await wait(async() => {
        const completedGoals: Goal[] = await new GoalQuery().failedGoals();
        expect(completedGoals.length).toEqual(1);
        const inactiveGoals: Goal[] = await new GoalQuery().inactiveGoals();
        expect(inactiveGoals.length).toEqual(1);
        activeGoals = await new GoalQuery().activeGoals();
        expect(activeGoals.length).toEqual(0);
    })

    await wait(async() => {
        const completedTasks: Task[] = await new TaskQuery().failedTasks();
        expect(completedTasks.length).toEqual(1);
        const inactiveTasks: Task[] = await new TaskQuery().inactiveTasks();
        expect(inactiveTasks.length).toEqual(1);
        activeTasks = await new TaskQuery().activeTasks();
        expect(activeTasks.length).toEqual(0);
    })

    await teardown();


    async function setup() {
        const opts = {
            parentId: ""
        }
        await DB.get().action(async () => {
            const parent = await DB.get().collections.get("goals").create((goal: Goal) => {
                goal.active = true;
                goal.title = "Parent";
                goal.state = "open"
            });

            opts.parentId = parent.id;
            const child = await DB.get().collections.get("tasks").create((task: Task) => {
                task.parentId = parent.id;
                task.active = true;
                task.title = "Child";
                task.state = "open"
            });
        });

        return opts;
    }

    async function teardown() {
        await destroyAll();
    }
}, 20000)

describe("streak goal tests", () => {
    test("If the minimum streak count is or can be met, completing succeeds", async () => {
        const { parentId } = await setup()
        {
            const { getByLabelText } = render(
                <GoalScreen navigation={makeNavigation({id: parentId})}></GoalScreen>
            );

            await wait(async () => {
                const completeButton = getByLabelText("input-goal-complete-button");
                fireEvent.press(completeButton);
            })
        } 

        await wait(async() => {
            const completedGoals: Goal[] = await new GoalQuery().completedGoals();
            expect(completedGoals.length).toEqual(1);
            const inactiveGoals: Goal[] = await new GoalQuery().inactiveGoals();
            expect(inactiveGoals.length).toEqual(1);
        })

        await wait(async() => {
            const completedTasks: Task[] = await new TaskQuery().completedTasks();
            expect(completedTasks.length).toEqual(2);
            const inactiveTasks: Task[] = await new TaskQuery().inactiveTasks();
            expect(inactiveTasks.length).toEqual(2);
        })

        await teardown();

        async function setup() {
            const opts = {
                parentId: ""
            }
            await DB.get().action(async () => {
                const parent = await DB.get().collections.get("goals").create((goal: Goal) => {
                    goal.active = true;
                    goal.title = "Parent";
                    goal.state = "open"
                    goal.streakMinimum = 2;
                    goal.goalType = GoalType.STREAK;
                });

                opts.parentId = parent.id;

                await createTasks({
                    parentId : parent.id,
                    active : true,
                    title : "Child",
                    state : "open",
                }, 2)
            });

            return opts;
        }

        async function teardown() {
            await destroyAll();
        }
    });

    test("If the minimum streak count isn't and cannot be met, completing gives an error message", async () => {

        const { parentId } = await setup();

        await wait(async() => {
            const completedGoals: Goal[] = await new GoalQuery().completedGoals();
            expect(completedGoals.length).toEqual(0);
            const inactiveGoals: Goal[] = await new GoalQuery().inactiveGoals();
            expect(inactiveGoals.length).toEqual(0);
        })

        await wait(async() => {
            const completedTasks: Task[] = await new TaskQuery().completedTasks();
            expect(completedTasks.length).toEqual(0);
            const inactiveTasks: Task[] = await new TaskQuery().inactiveTasks();
            expect(inactiveTasks.length).toEqual(0);
        })

        {
            const { getByLabelText } = render(
                <GoalScreen navigation={makeNavigation({id: parentId})}></GoalScreen>
            );

            let completeButton;
            await wait(async () => {
                completeButton = getByLabelText("input-goal-complete-button");
            })
            fireEvent.press(completeButton);
        } 

        await wait(async() => {
            const completedTasks: Task[] = await new TaskQuery().completedTasks();
            expect(completedTasks.length).toEqual(0);
            const inactiveTasks: Task[] = await new TaskQuery().inactiveTasks();
            expect(inactiveTasks.length).toEqual(0);
        })

        await wait(async() => {
            // no goals should have completed, since the minimum is 2 and there is only 1 child.
            const inactiveGoals: Goal[] = await new GoalQuery().inactiveGoals();
            expect(inactiveGoals.length).toEqual(0);
            const completedGoals: Goal[] = await new GoalQuery().completedGoals();
            expect(completedGoals.length).toEqual(0);
        })

        await teardown();

        async function setup() {
            const opts = {
                parentId: ""
            }
            await DB.get().action(async () => {
                const parent = (await createGoals({
                    active : true,
                    title : "Parent",
                    state : "open",
                    streakMinimum : 2,
                    goalType : GoalType.STREAK,
                }, 1))[0];

                debugger;

                opts.parentId = parent.id;

                await createTasks({
                    parentId : parent.id,
                    active : true,
                    title : "Child",
                    state : "open",
                }, 1)
            });

            return opts;
        }

        async function teardown() {
            await destroyAll();
        }
    }, 20000);

})