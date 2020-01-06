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
}

export {
    DB as Database
}