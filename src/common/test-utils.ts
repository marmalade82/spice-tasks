
jest.mock("src/Models/Database");
import DB from "src/Models/Database";
import { Model } from "@nozbe/watermelondb";

function makeNavigation(params: {}) {
    const navigation = {
        navigate: jest.fn(),
        getParam: jest.fn((param: string, fallback: any) => {
            if(params[param] !== undefined) {
                return params[param];
            } else {
                return fallback;
            }
        }),
        goBack: jest.fn(),
    }
    return navigation;
}

async function destroyAllIn(table: string) {
    let models = await DB.get().collections.get(table).query().fetch();

    await DB.get().action(async() => {
        models.forEach(async (model: Model) => {
            await model.destroyPermanently();
        });
    });

    models = await DB.get().collections.get(table).query().fetch();

    expect(models.length).toEqual(0);
}

export {
    makeNavigation,
    destroyAllIn,
}
