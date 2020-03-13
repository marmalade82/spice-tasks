
import { Model, Relation } from "@nozbe/watermelondb";
import { field, date, children, relation } from "@nozbe/watermelondb/decorators";
import { GroupSchema } from "./GroupSchema";

export interface IStreakCycle {
    type: "streak_cycle";
    parentGoalId: string;
    startDate: Date;
    endDate: Date;
}

const name = GroupSchema.name;

export default class StreakCycle extends Model implements IStreakCycle {
    static table = GroupSchema.table

    @field(name.TYPE) type!: "streak_cycle";
    @field(name.PARENT) parentGoalId!: string;
    @date(name.STARTS_ON) startDate!: Date;
    @date(name.DUE_ON) endDate!: Date;
}

export {
    StreakCycle
}