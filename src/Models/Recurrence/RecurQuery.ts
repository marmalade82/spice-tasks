
import ModelQuery from "src/Models/base/Query";
import {
    Recur, IRecur,
} from "src/Models/Recurrence/Recur";
import { RecurSchema } from "src/Models/Recurrence/RecurSchema";
import { Q, Database, Model } from "@nozbe/watermelondb";
import { Conditions, findAllChildrenIn } from "src/Models/common/queryUtils"
import DB from "src/Models/Database";
import MyDate from "src/common/Date";
import GoalQuery, { GoalLogic, IGoal, Goal } from "../Goal/GoalQuery";

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
     * This function is responsible for generating the next goals in the sequence.
     * Because mobile apps are and function on devices that may turn off, and this 
     * app will not communicate with the server, this function must restore all missing 
     * goals in the sequence, no matter how far behind the sequence has gotten due to,
     * say, the phone being turned off for a month.
     */
    generateNext = async (timeUntilNext?: number) => {
        const recur = await new RecurQuery().get(this.id);
        if(recur) {
            const oldGoals = await new GoalQuery().inRecurrence(this.id);
            const latestGoal = oldGoals.sort((a, b) => {
                return b.startDate.valueOf() - a.startDate.valueOf();
            })[0];

            if(latestGoal) {
                switch(recur.type) {
                    case "once": {
                        let startDate = new MyDate(recur.date);
                        let newGoal: IGoal | undefined = undefined;
                        let newStart: MyDate | undefined = undefined
                        if( startDate.inNext("minutes", timeUntilNext ? timeUntilNext : 50)) {
                            newStart = startDate;
                        }
                        if(newGoal && newStart) {
                            newGoal = await new GoalLogic(latestGoal.id).cloneRelativeTo(latestGoal.startDate, newStart.toDate());
                            void new GoalQuery().create(newGoal);
                        }
                    } break;
                    case "daily": {
                        void this._generateNext(latestGoal.id, latestGoal.startDate, "days");
                    } break;
                    case "weekly": {
                        void this._generateNext(latestGoal.id, latestGoal.startDate, "weeks");
                    } break;
                    case "monthly": {
                        void this._generateNext(latestGoal.id, latestGoal.startDate, "months");
                    } break;
                    default: {
                        //do nothing otherwise
                    }
                } 
            }
        }
    }

    _generateNext = async (id: string, d: Date, unit: "days" | "weeks" | "months") => {
        // We take the latest goal's start date. If we are in the day after the latest goal's start date/time,
        // then we add the goal again. If we are AFTER the day after the latest goal's start date/time,
        // then we add the goal until we have reached the current start date/time.
        let start = d;
        let goals: Promise<IGoal>[] = [];
        let logic = new GoalLogic(id);
        while(new MyDate().isInOrAfterNextCycleAfterDate(start, unit)) {
            const next = new MyDate(start).add(1, unit);
            const goal = logic.cloneRelativeTo(d, next.toDate());
            goals.push(goal);
            start = next.toDate();
        }

        let fullGoals = await Promise.all(goals)
        void new GoalQuery().createMultiple(fullGoals);
    }
}