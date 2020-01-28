
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import React from "react";

import { fireEvent, render, wait, waitForElement, waitForElementToBeRemoved, cleanup } from '@testing-library/react-native';
import { 
    makeNavigation, destroyAll,
    createPenalties,
} from "src/common/test-utils";
import MyDate from "src/common/Date";
import PenaltyQuery from "src/Models/Penalty/PenaltyQuery";
import AddPenaltyScreen from "src/Screens/Penalties/AddPenaltyScreen";



test("User has access to fields for entering/editing data on the penalty", async () => {
    await setup();

    const { getByLabelText } = render(
        <AddPenaltyScreen
            navigation={makeNavigation({})}
        >
        </AddPenaltyScreen>
    );

    await wait(async () => {
        const inputName = getByLabelText("input-penalty-name");

        const inputDescription = getByLabelText("input-penalty-description");

        const modalExpireDate = getByLabelText("modal-penalty-expire-date");
    })

    await teardown();

    async function setup() {

    }

    async function teardown() {
        await destroyAll();
    }
}, 20000)

test("Using the save button when the screen has no id will create a new penalty", async () => {

    const { getByLabelText } = render(
        <AddPenaltyScreen
            navigation={makeNavigation({})}
        ></AddPenaltyScreen>
    );

    const inputName = getByLabelText("input-penalty-name");
    fireEvent.changeText(inputName, "Hello!");

    const save = getByLabelText("input-save-button")
    fireEvent.press(save)

    await wait(async () => {
        const penalties = await new PenaltyQuery().all();
        expect(penalties.length).toEqual(1);
        expect(penalties[0].title).toEqual("Hello!")
    })

    await teardown();
    async function teardown() {
        await destroyAll();
    }
})

test("Using the save button when the screen has an id will edit the existing penalty", async () => {
    const { id } = await setup();
    console.log("ID WAS " + id);

    await wait(async () => {
        const penalties = await new PenaltyQuery().all();
        expect(penalties.length).toEqual(1);
    })
    const { getByText, getByDisplayValue, getByLabelText } = render(
        <AddPenaltyScreen
            navigation={makeNavigation({ id: id })}
        ></AddPenaltyScreen>
    );

    await wait(async () => {
        const oldName = getByDisplayValue("one");
    })

    const inputName = getByLabelText("input-penalty-name");
    fireEvent.changeText(inputName, "Hello!");

    const save = getByLabelText("input-save-button")
    fireEvent.press(save)

    await wait(async () => {
        const penalties = await new PenaltyQuery().all();
        expect(penalties.length).toEqual(1);
        expect(penalties[0].title).toEqual("Hello!")
    })

    await teardown();

    async function setup() {
        const opts = {
            id: "",
        }

        await DB.get().action(async () => {
            const penalty = (await createPenalties({
                title: "one"
            }, 1))[0]

            opts.id = penalty.id;
        })

        return opts;
    }

    async function teardown() {
        await destroyAll();
    }
}, 10000)