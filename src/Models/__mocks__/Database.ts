
import { Database } from "@nozbe/watermelondb";
import { Schema } from "src/Models/Schema";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import Goal from "src/Models/Goal/Goal";
import Task from "src/Models/Task/Task";
import Reward from "src/Models/Reward/Reward";
import EarnedReward from "src/Models/Reward/EarnedReward";
import ClaimedReward from "src/Models/Reward/ClaimedReward";

class DB {
    static database: Database | undefined;

    static get = () => {
        if(DB.database !== undefined) {
            return DB.database;
        } else {
            const adapter = new LokiJSAdapter({
                schema: Schema,
            });

            DB.database = new Database({
                adapter: adapter,
                modelClasses: [Goal, Task, Reward, EarnedReward, ClaimedReward],
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