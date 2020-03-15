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
            type: "streak_cycle",
            parentGoalId: "",
            startDate: startDate(new Date()),
            endDate: dueDate(new Date()),
        } as const;
    }

    queries = () => {
        return [
            Q.where(GroupSchema.name.TYPE, "streak_cycle"),
        ];
    }

    queryInGoal = (goalId: string) => {
        return this.query(
            Q.where(GroupSchema.name.PARENT, goalId)
        );
    }

    queryDueOnBefore = (date: Date) => {
        return this.query(
            ...Conditions.dueOnOrBefore(date),
        )
    }

    queryDueOnBeforeInGoal = (goalId: string, date: Date) => {
        return this.query(
            Q.and(...Conditions.dueOnOrBefore(date)),
            Q.and(Q.where(GroupSchema.name.PARENT, goalId))
        )
    }

    queryDueAfterInGoal = (goalId: string, date: Date) => {
        return this.query(
            Q.and(...Conditions.dueAfter(date)),
            Q.and(Q.where(GroupSchema.name.PARENT, goalId))
        );
    }

    endsAfterInGoal = async(goalId: string, date: Date) => {
        return await this.queryDueAfterInGoal(goalId, date).fetch();
    }

    calculatedLatestInGoal = async (goalId: string) => {
        const cycles = await new StreakCycleQuery().queryInGoal(goalId).fetch();
        const sorted = cycles.sort((a, b) => {
            return b.startDate.valueOf() - a.startDate.valueOf()
        })

        return sorted[0] ? sorted[0] : null;
    }

    inGoalCurrentCycle = async (goalId: string) => {
        const goal = await new GoalQuery().get(goalId);
        if(goal) {
            console.log("starts " + goal.currentCycleStart().toString());
            console.log("ends " + goal.currentCycleEnd().toString())
            const cycles = await this.query(
                ...[
                ...Conditions.startsOnOrAfter(goal.currentCycleStart()),
                ...Conditions.startsBefore(goal.currentCycleEnd()),
                ...[Q.where(GroupSchema.name.PARENT, goalId)]
                ]
            ).fetch();

            if(cycles[0]) {
                return cycles[0];
            } else {
                console.log("no cycle found for goal")
                return null;
            }
        }

        console.log("no goal found");
        return null;
    }
}

export default StreakCycleQuery;

export class StreakCycleLogic {
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}