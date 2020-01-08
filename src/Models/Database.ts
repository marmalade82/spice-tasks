import { Database } from "@nozbe/watermelondb";
import { Schema } from "src/Models/Schema";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import Goal from "src/Models/Goal/Goal";

class DB {
    static database: Database | undefined;

    static get = () => {
        if(DB.database !== undefined) {
            return DB.database;
        } else {
            const adapter = new SQLiteAdapter({
                schema: Schema,
            });

            DB.database = new Database({
                adapter: adapter,
                modelClasses: [Goal],
                actionsEnabled: true,
            });

            return DB.database;
        }
    }

    static loadDummyData = async () => {
        DB.clearDB();
        const db = DB.get();
        const goalsCollection = db.collections.get('goals');
        await db.action(async() => {
            await goalsCollection.create((goal: Goal) => {
                goal.title = 'hello world';
            })
        })
    }

    static clearDB = () => {

    }
}

export default DB;

export {
    DB
}