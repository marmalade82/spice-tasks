import { Database } from "@nozbe/watermelondb";
import { Schema } from "src/Models/Schema";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import Goal from "src/Models/Goal/Goal";
import Task from "src/Models/Task/Task";
import Reward from "src/Models/Reward/Reward";
import EarnedReward from "src/Models/Reward/EarnedReward";
import Penalty from "src/Models/Penalty/Penalty";
import Recur from "src/Models/Recurrence/Recur";
import Global from "src/Models/Global/Global";
import StreakCycle from "src/Models/Group/StreakCycle";

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
                modelClasses: [Goal, Task, Reward, EarnedReward, Penalty, Recur, Global, 
                    StreakCycle
                ],
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