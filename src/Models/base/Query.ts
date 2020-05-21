
import DB from "src/Models/Database";
import { Model as M, Query, Q } from "@nozbe/watermelondb";
import { Exact } from "src/common/types";
import { Condition } from "@nozbe/watermelondb/QueryDescription";

interface IModelQuery<Model extends M & IModel, IModel> {
    store: () => any;
    queryAll: () => any;
    all: () => any;
    get: (id: string) => any;
    default: () => IModel;
    create: (p: Exact<Partial<IModel>>) => any;
    update: (m: Model, p: Exact<Partial<IModel>>) => any;
    queries: () => Condition[];
    queryId: (id) => Query<M>;
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

    queryId = (id: string) => {
        return this.query(
            Q.where("id", id)
        )
    }

    queryAll = () => {
        return this.query();
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

    protected query = (...conditions: Condition[]) => {
        return this.store().query(
            ...[...this.queries(), ...conditions]
        ) as Query<Model>
    }

    /**
     * Expresses the default filters that run with ALL queries with this class.
     */
    abstract queries(): Condition[];

    abstract default(): IModel

    assign = (target: Model, source: Partial<IModel>): Model => {
        Object.assign(target, source);
        return target;
    }

    /**Specifies the assignment from the interface to the model itself. */
    //abstract assign(target: Model, source: Partial<IModel>): Model;

    create = async (props: Exact<Partial<IModel>>) => {
        const Default = this.default();
        let id = "";
        await DB.get().action(async () => {
            let m = await this.store().create((m: Model) => {
                this.assign(m, Default);
                this.assign(m, props);
            }) as Model;
            id = m.id;
        });

        return await this.get(id)
    }

    prepareCreate = (schema: Exact<Partial<IModel>>) => {
        const Default = this.default();
        return this.store().prepareCreate((m: Model) => {
            this.assign(m, Default);
            this.assign(m, schema)
        })
    }

    createMultiple = async (models: Exact<Partial<IModel>>[]) => {
        const Default = this.default();
        await DB.get().action(async () => {
            await DB.get().batch(
                ...models.map((model) => {
                    return this.store().prepareCreate((m: Model) => {
                        this.assign(m, Default);
                        this.assign(m, model);
                    })
                })
            )
        })
    }

    update = async (model: Model, props: Exact<Partial<IModel>>) => {
        return await DB.get().action(async () => {
            await model.update((m: Model) => {
                this.assign(m, props);
            });
        });
    }

    prepareUpdate = (model: Model, schema: Exact<Partial<IModel>>) => {
        return model.prepareUpdate((m: Model) => {
            this.assign(m, schema);
        })
    }

    prepareDelete = (model: Model) => {
        return model.prepareDestroyPermanently();
    }

    delete = async(id: string) => {
        const model = await this.get(id);
        if(model) {
            await DB.get().action(async () => {
                await model.destroyPermanently();
            });
        }
    }
}

export {
    ModelQuery,
    IModelQuery,
}