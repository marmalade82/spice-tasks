
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";
import { fireEvent, render, wait, waitForElement } from '@testing-library/react-native';
import AddTaskScreen from "src/Screens/Tasks/AddTaskScreen";
import { makeNavigation, destroyAllIn, createTasks, destroyAll, createGoals, waitForAsyncLifecycleMethods } from "src/common/test-utils";
import TaskQuery from "src/Models/Task/TaskQuery";
import MyDate from "src/common/Date";

describe("Validation", () => {
    afterEach(async () => {
        await destroyAll();
    })

    test("Summary is required", async () => {
        const navigation = makeNavigation({});
        const { getByLabelText, queryByLabelText, getByText, queryByText } = 
                    render(<AddTaskScreen navigation={navigation}></AddTaskScreen>)
        const toast = queryByLabelText('toast');
        expect(toast).toEqual(null);

        {
            const { getByLabelText } = render(AddTaskScreen.navigationOptions({ navigation }).right[0]())
            await waitForAsyncLifecycleMethods();
            const saveButton = getByLabelText("input-save-button");
            fireEvent.press(saveButton);
        }

        await wait(async () => {
            const toast = getByLabelText("toast");
        })
    })

    test.skip("For normal goal parent, task start and due date is restricted by parent goal", async () => {
        const { parentId } = await setup();

        {
            const { getByLabelText, queryByLabelText, getByText, queryByText } = 
                        render(<AddTaskScreen navigation={makeNavigation({ parent_id: parentId })}></AddTaskScreen>)

            const toast = queryByLabelText('toast');
            expect(toast).toEqual(null);

            const nameInput = getByLabelText("input-task-name");
            fireEvent.changeText(nameInput, "Dummy value");

            const dueInput = getByLabelText("value-input-task-due-date");
            fireEvent.changeText(dueInput, new MyDate().add(1, "weeks").add(1, "days").toDate().toString());

            await wait(async () => {
                getByLabelText("toast");
            })
        }

        {
            const { getByLabelText, queryByLabelText, getByText, queryByText } = 
                        render(<AddTaskScreen navigation={makeNavigation({ parent_id: parentId })}></AddTaskScreen>)

            const toast = queryByLabelText('toast');
            expect(toast).toEqual(null);

            const nameInput = getByLabelText("input-task-name");
            fireEvent.changeText(nameInput, "Dummy value");

            const startInput = getByLabelText("value-input-task-start-date");
            fireEvent.changeText(startInput, new MyDate().subtract(1, "weeks").subtract(1, "days").toDate().toString());

            await wait(async () => {
                getByLabelText("toast");
            })
        }

        async function setup() {
            const opts = {
                parentId: "",
                id: "",
            }

            await DB.get().action(async () => {
                const goal = (await createGoals({
                    startDate: new MyDate().subtract(1, "weeks").toDate(),
                    dueDate: new MyDate().add(1, "weeks").toDate(),
                }, 1))[0];

                opts.parentId = goal.id;
            })

            return opts;
        }
    }, 10000)

    test.skip("For streak goal, task start and due dates are restricted by cycle", async () => {
        expect(true).toEqual(false);
    }, 10000)
});