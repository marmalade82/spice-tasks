import DB from "src/Models/Database"
import BatchedBridge from "react-native/Libraries/BatchedBridge/BatchedBridge"
import { Model as M, Model } from "@nozbe/watermelondb"
import ModelQuery, { IModelQuery } from "src/Models/base/Query";

import { Exact } from "src/common/types";





/**
 * Works with other DB logic to batch creates and updates together.
 */
export default class Transaction {
    batch: M[] = [];

    addCreate = <Model extends M & IModel, IModel>(q: ModelQuery<Model, IModel>, schema: Exact<Partial<IModel>>) => {
        this.batch.push(
            q.prepareCreate(schema)
        );
    }

    addUpdate = <Model extends M & IModel, IModel>(q: ModelQuery<Model, IModel>, model: Model, schema: Exact<Partial<IModel>>) => {
        this.batch.push(
            q.prepareUpdate(model, schema)
        );
    }

    addDelete = <Model extends M & IModel, IModel>(q: ModelQuery<Model, IModel>, model: Model) => {
        this.batch.push(
            q.prepareDelete(model),
        );
    }

    /**
     * Finalizes a transaction and sends them all as one to the DB.
     */
    commit = async () => {
        await DB.get().action(async () => {
            await DB.get().batch(
                ...this.batch
            )
        })
        this.batch = [];
    }

    commitAndReset = () => {
        void this.commit();
        this.reset();
    }

    /**
     * Removes everything from the gathered transaction
     */
    reset = () => {
        this.batch = [];
    }
}