jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";
import GoalListScreen from "src/Screens/Goals/GoalListScreen";
import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAllIn,
    createGoals, createTasks,
} from "src/common/test-utils";
import MyDate from "src/common/Date";



test("User can view all goals from this screen", async () => {
    await setup();

    {
        const { queryAllByLabelText } = render(
            <GoalListScreen
                navigation={makeNavigation({})}
            ></GoalListScreen>
        );

        await wait(() => {
            const goals = queryAllByLabelText("goal-list-item");
            expect(goals.length).toEqual(4);
        });
    }


    await teardown();

    async function setup() {
        await DB.get().action(async () => {
            await createGoals({
                active: true,
                state: 'open',
            }, 1);

            await createGoals({
                active: true,
                state: 'in_progress',
            }, 1);

            await createGoals({
                active: false,
                state: "complete",
            }, 1);

            await createGoals({
                active: false,
                state: "cancelled",
            }, 1)
        });

    }

    async function teardown() {
        await destroyAllIn("goals");
    }
});


test.skip("User can sort list by title", async () => {
    await setup()

    await teardown()

    async function setup() {
        await createGoals({
            title: "A"
        }, 1);

        await createGoals({
            title: "C"
        }, 1);

        await createGoals({
            title: "B"
        }, 1);
    }

    async function teardown() {
        destroyAllIn("goals");
    }
});

test.skip("User can sort by start date", async () => {
    await setup()

    await teardown()

    async function setup() {
        await createGoals({
            startDate: new MyDate().subtract(1, "days").toDate()
        }, 1);

        await createGoals({
            startDate: new MyDate().subtract(3, "days").toDate()
        }, 1);

        await createGoals({
            startDate: new MyDate().subtract(2, "days").toDate()
        }, 1);
    }

    async function teardown() {
        destroyAllIn("goals");
    }

});

test.skip("User can sort by due date", async () => {
    await setup()

    await teardown()

    async function setup() {
        await createGoals({
            dueDate: new MyDate().subtract(1, "days").toDate()
        }, 1);

        await createGoals({
            dueDate: new MyDate().subtract(1, "days").toDate()
        }, 1);

        await createGoals({
            dueDate: new MyDate().subtract(1, "days").toDate()
        }, 1);
    }

    async function teardown() {
        destroyAllIn("goals");
    }
})

