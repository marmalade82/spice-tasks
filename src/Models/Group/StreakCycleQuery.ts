import ModelQuery from "src/Models/base/Query";
import { StreakCycle, IStreakCycle } from "src/Models/Group/StreakCycle";
import { Q } from "@nozbe/watermelondb";
import { GroupSchema } from "src/Models/Group/GroupSchema";
import { startDate, dueDate } from "src/Components/Forms/common/utils";
import { Conditions } from "../common/queryUtils";
import GoalQuery from "../Goal/GoalQuery";




export class StreakCycleQuery extends ModelQuery<StreakCycle, IStreakCycle> {

    constructor() {
        super(GroupSchema.table);
    }

    default = () => {
        return {
            type: "streak_cycle" as "streak_cycle",
            parentGoalId: "",
            startDate: startDate(new Date()),
            endDate: dueDate(new Date()),
        };
    }

    queries = () => {
        return [
            Q.where(GroupSchema.name.TYPE, "streak_cycle"),
        ];
    }

    queryDueOnBefore = (date: Date) => {
        return this.query(
            ...Conditions.dueOnOrBefore(date),
        )
    }
}

export default StreakCycleQuery;

export class ChildStreakCycleQuery extends ModelQuery<StreakCycle, IStreakCycle>{
    goalId: string;
    constructor(parentId: string) {
        super(GroupSchema.table);
        this.goalId = parentId;
    }

    default = () => {
        let def = new StreakCycleQuery().default();
        def.parentGoalId = this.goalId;
        return def;
    }

    queries = () => {
        return new StreakCycleQuery().queries().concat([
            Q.where(GroupSchema.name.PARENT, this.goalId) 
        ])
    }

    queryEndsOnBefore = (date: Date) => {
        return this.query(
            ...Conditions.dueOnOrBefore(date),
        )
    }

    queryEndsAfter = (date: Date) => {
        return this.query(
            Q.and(...Conditions.dueAfter(date)),
        );
    }

    endsAfter = async(date: Date) => {
        return await this.queryEndsAfter(date).fetch();
    }

    latest = async() => {
        const goal = await new GoalQuery().get(this.goalId);
        if(goal) {
            //We'll try to get it if it's cached.
            const cycle = await this.get(goal.latestCycleId);
            if(cycle) {
                return cycle;
            } else {
                // If it isn't cached, we'll have to calculate it.
                const cycles = await this.queryAll().fetch();
                const descending = cycles.sort((a, b) => {
                    return b.startDate.valueOf() - a.startDate.valueOf()
                })

                return descending[0] ? descending[0] : null;
            }
        }

        return null;
    }

    inCurrentCycle = async () => {
        const goal = await new GoalQuery().get(this.goalId);
        if(goal) {
            const cycles = await this.query(
                ...[
                ...Conditions.startsOnOrAfter(goal.currentCycleStart()),
                ...Conditions.startsBefore(goal.currentCycleEnd()),
                ]
            ).fetch();

            if(cycles[0]) {
                return cycles[0];
            } else {
                return null;
            }
        }

        return null;
    }
}

export class StreakCycleLogic {
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}