
import DB from "src/Models/Database";
import { Model as M } from "@nozbe/watermelondb";

export default abstract class ModelQuery<Model extends M & IModel, IModel> {
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

    all = () => {
        return this.queryAll().fetch();
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

    create = async (props: Partial<IModel>) => {
        const Default = this.default();

        return DB.get().action(async () => {
            this.store().create((m: Model) => {
                Object.assign(m, Default);
                Object.assign(m, props);
            });
        });
    }

    update = async (model: Model, props: Partial<IModel>) => {
        return DB.get().action(async () => {
            model.update((m: Model) => {
                Object.assign(m, props);
            });
        });
    }
}