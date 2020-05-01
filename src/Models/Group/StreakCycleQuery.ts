import ModelQuery from "src/Models/base/Query";
import { StreakCycle, IStreakCycle } from "src/Models/Group/StreakCycle";
import { Q } from "@nozbe/watermelondb";
import { GroupSchema } from "src/Models/Group/GroupSchema";
import { startDate, dueDate } from "src/Components/Forms/common/utils";
import { Conditions } from "../common/queryUtils";
import GoalQuery from "../Goal/GoalQuery";
import MyDate from "src/common/Date";
import { assignAll } from "src/common/types";


function endsOnBeforeConditions(d: Date) {
    return Conditions.dueOnOrBefore(d);
}

export class StreakCycleQuery extends ModelQuery<StreakCycle, IStreakCycle> {

    constructor() {
        super(GroupSchema.table);
    }

    assign = (target: StreakCycle, source: Partial<IStreakCycle>) => {
        return assignAll([], target, source) as StreakCycle;
    }

    default = () => {
        return {
            type: "streak_cycle" as "streak_cycle",
            parentGoalId: "",
            startDate: startDate(MyDate.Now().toDate()),
            endDate: dueDate(MyDate.Now().toDate()),
        };
    }

    queries = () => {
        return [
            Q.where(GroupSchema.name.TYPE, "streak_cycle"),
        ];
    }

    queryEndsOnBefore = (date: Date) => {
        return this.query(
            ...endsOnBeforeConditions(date)
        )

    }

    exists = (cycleStart: Date, parentId: string, unit: "days" | "weeks" | "months") => {
        const actualStart = new MyDate(cycleStart).asStartDate().toDate();
        const actualEnd = new MyDate(cycleStart).add(1, unit).add(1, "days").asStartDate().toDate();

        return this.query(
            Q.where(GroupSchema.name.STARTS_ON, Q.gte(actualStart.valueOf())),
            Q.where(GroupSchema.name.DUE_ON, Q.lt(actualEnd.valueOf())),
            Q.where(GroupSchema.name.PARENT, parentId),
        ).fetch();
    }
}

export default StreakCycleQuery;

export class ChildStreakCycleQuery extends ModelQuery<StreakCycle, IStreakCycle>{
    goalId: string;
    constructor(parentId: string) {
        super(GroupSchema.table);
        this.goalId = parentId;
    }

    assign = (target: StreakCycle, source: Partial<IStreakCycle>) => {
        return assignAll([], target, source) as StreakCycle;
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
            ...endsOnBeforeConditions(date),
        )
    }

    queryEndsAfter = (date: Date) => {
        return this.query(
            Q.and(...Conditions.dueAfter(date)),
        );
    }

    queryStartsOnAfter = (date: Date) => {
        return this.query(
            Q.and(...Conditions.startsOnOrAfter(date))
        )
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