
import ModelQuery from "src/Models/base/Query";
import {
    Recur, IRecur,
} from "src/Models/Recurrence/Recur";
import { RecurSchema } from "src/Models/Recurrence/RecurSchema";
import { Q, Database, Model } from "@nozbe/watermelondb";
import { Conditions, findAllChildrenIn } from "src/Models/common/queryUtils"
import DB from "src/Models/Database";
import MyDate from "src/common/Date";
import GoalQuery, { GoalLogic } from "../Goal/GoalQuery";

export default class RecurQuery extends ModelQuery<Recur, IRecur> {
    constructor() {
        super(RecurSchema.table);
    }

    queryActive = () => {
        return this.store().query(
            ...Conditions.active()
        );
    }

    active = async () => {
        return (await this.queryActive().fetch()) as Recur[];
    }

    default = () => {
        return {
            type: "never",
            date: new Date(), 
            // are these necessary? It would be simpler to just assume that they recur at the same time.
            time: new Date(),
            weekDay: "sunday",
            monthDay: 1,
            active: true,
        } as const;
    }
}

export class RecurLogic {
    valid: boolean;
    id: string;
    constructor(id: string) {
        this.valid = true;
        this.id = id;
    }

    /**
     * This function is responsible for generating the next goal in the sequence.
     * However, because mobile apps are and function on devices that may turn off, and this 
     * app will not communicate with the server, the actual need is to have a function that generates ALL
     * goals in the sequence, regardless of how far in the past the last goal is.
     */
    generateNext = async (timeUntilNext?: number) => {
        const recur = await new RecurQuery().get(this.id);
        if(recur) {
            switch(recur.type) {
                case "never": {

                } break;
                case "once": {
                    let startDate = new MyDate(recur.date);
                    if( startDate.inNext("minutes", timeUntilNext ? timeUntilNext : 50)) {
                        const oldGoals = await new GoalQuery().inRecurrence(this.id)
                        const oldGoal = oldGoals.sort((a, b) => {
                            return a.startDate.valueOf() - b.startDate.valueOf();
                        })[0];
                        if(oldGoal) {
                            const newGoal = await new GoalLogic(oldGoal.id).cloneRelativeTo(oldGoal.startDate, startDate.toDate());
                            void new GoalQuery().create(newGoal);
                        }

                    }
                } break;
                case "daily": {

                } break;
                case "weekly": {

                } break;
                case "monthly": {

                } break;
                default: {
                    //do nothing otherwise
                }
            }
        }
    }
}