jest.mock("src/Models/Database");

import React from "react";
import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { makeNavigation } from "src/common/test-utils";
import TaskScreen from "src/Screens/Tasks/TaskScreen";
import { TaskQuery, Task, ITask } from "src/Models/Task/TaskQuery";
import DB from "src/Models/Database";


afterEach(cleanup);

/**
 * Initializes the database with some basic data
 */
async function setup() {
    const opts = {
        parentId: ""
    }
    await DB.get().action(async () => {
        const parent = (await DB.get().collections.get('tasks').create((task: Task & ITask) => {
            task.title = "Parent";
            task.active = true;
            task.state = 'open';
        })) as Task;

        opts.parentId = parent.id

        const child = (await DB.get().collections.get('tasks').create((task: Task) => {
            task.parentId = parent.id;
            task.title= "Child";
            task.active = true;
            task.state = 'open';
        }));
    });

    return opts;
}

/**
 * Clears the database so the next test can use it properly.
 */
async function teardown() {
    const tasks = await DB.get().collections.get('tasks').query().fetch();

    await DB.get().action(async() => {
        tasks.forEach(async (task: Task) => {
            await task.destroyPermanently();
        });
    });
}



test("User has access to the complete button", async() => {
    const { getByLabelText, queryByLabelText, getByText, queryByText } = render(<TaskScreen navigation={makeNavigation({})}></TaskScreen>)
    const completeButton = getByLabelText("input-task-complete-button");
});

test("User can complete a task and mark both it and its children as 'Completed' and 'Inactive'" +
        " so the user can no longer see them in the list of active tasks", async () => {
    const opts = await setup();

    let activeTasks: Task[] = await new TaskQuery().activeTasks();
    expect(activeTasks.length).toEqual(2);

    {
        const { getByLabelText } = render(
            <TaskScreen navigation={makeNavigation({id: opts.parentId})}></TaskScreen>
        );
        const completeButton = getByLabelText("input-task-complete-button");
        fireEvent.press(completeButton);
    } 

    await wait(async() => {
        const completedTasks: Task[] = await new TaskQuery().completedTasks();
        expect(completedTasks.length).toEqual(2);
        const inactiveTasks: Task[] = await new TaskQuery().inactiveTasks();
        expect(inactiveTasks.length).toEqual(2);
    })

    await wait(async () => {
        activeTasks = await new TaskQuery().activeTasks();
        expect(activeTasks.length).toEqual(0);
    })

    await teardown();
}, 20000);