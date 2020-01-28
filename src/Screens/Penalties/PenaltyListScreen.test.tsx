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
import PenaltyListScreen from "src/Screens/Penalties/PenaltyListScreen";


test("User can view all penalties in the database", async () => {
    await setup();

    const { queryAllByLabelText } = render(
        <PenaltyListScreen
            navigation={makeNavigation({})}
        ></PenaltyListScreen>
    )

    await wait(async () => {
        expect((await new PenaltyQuery().all()).length).toEqual(2);
        const penalties = queryAllByLabelText("penalty-list-item");
        expect(penalties.length).toEqual(2);
    })

    await teardown();

    async function setup() {
        await DB.get().action(async () => {
            await createPenalties({
                title: "Penalty",
                expireDate: new MyDate().toDate(),
                details: "",
            }, 2)
        });
    }

    async function teardown() {
        await destroyAll();
    }
})