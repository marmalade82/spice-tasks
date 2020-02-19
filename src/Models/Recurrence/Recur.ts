
import { Model } from "@nozbe/watermelondb";
import { field, date, relation, action, readonly} from "@nozbe/watermelondb/decorators";
import { RecurSchema } from "src/Models/Recurrence/RecurSchema";
import { isTSImportEqualsDeclaration } from "@babel/types";
import { weekdays } from "moment";

export interface IRecur {
    type: "never" | "once" | "daily" | "weekly" | "monthly"
    date: Date,
    time: Date,
    weekDay: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    monthDay: number;
}

const name = RecurSchema.name;

export default class Recur extends Model implements IRecur {
    static table = RecurSchema.table;

    @field(name.TYPE) type!: "never" | "once" | "daily" | "weekly" | "monthly"
    @date(name.DATE) date!: Date 
    @date(name.TIME) time! : Date 
    @field(name.WEEK_DAY) weekDay!: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    @field(name.MONTH_DAY) monthDay!: number;
}

export {
    Recur
}