
import DB from "src/Models/Database";
import { Model as M } from "@nozbe/watermelondb";
import { Exact } from "src/common/types";

interface IModelQuery<Model extends M & IModel, IModel> {
    store: () => any;
    queryAll: () => any;
    all: () => any;
    get: (id: string) => any;
    default: () => IModel;
    create: (p: Exact<Partial<IModel>>) => any;
    update: (m: Model, p: Exact<Partial<IModel>>) => any;
}

export default abstract class ModelQuery<Model extends M & IModel, IModel> implements IModelQuery<Model, IModel> {
    table: string;
    constructor(t: string) {
        this.table = t;
    }

    store = () => {
        const db = DB.get();
        const collection = db.collections.get(this.table);
        return collection;
    }

    queryAll = () => {
        return this.store().query();
    }

    all = async () => {
        return (await this.queryAll().fetch()) as Model[];
    }

    get = async (id: string) => {
        try {
            const model = await this.store().find(id)
            return model as Model;
        } catch {
            return null;
        }
    }

    abstract default(): IModel

    create = async (props: Exact<Partial<IModel>>) => {
        const Default = this.default();

        return DB.get().action(async () => {
            await this.store().create((m: Model) => {
                Object.assign(m, Default);
                Object.assign(m, props);
            });
        });
    }

    createMultiple = async (models: Exact<Partial<IModel>>[]) => {
        const Default = this.default();
        await DB.get().action(async () => {
            await DB.get().batch(
                ...models.map((model) => {
                    return this.store().prepareCreate((m: Model) => {
                        Object.assign(m, Default);
                        Object.assign(m, model);
                    })
                })
            )
        })
    }

    update = async (model: Model, props: Exact<Partial<IModel>>) => {
        return DB.get().action(async () => {
            await model.update((m: Model) => {
                Object.assign(m, props);
            });
        });
    }
}

export {
    ModelQuery,
    IModelQuery,
}