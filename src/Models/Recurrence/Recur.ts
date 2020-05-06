
import { Model } from "@nozbe/watermelondb";
import { field, date, relation, action, readonly} from "@nozbe/watermelondb/decorators";
import { RecurSchema } from "src/Models/Recurrence/RecurSchema";

export interface IRecur {
    type: "daily" | "weekly" | "monthly"
    active: boolean;
    lastRefreshed: Date,
}

const name = RecurSchema.name;

/**
 * Data that specifies a schedule for something that repeats.
 * For example, a bunch of goals could have a foreign id to a recurrence. That expresses how they are all related 
 * to the recurrence.
 */
export default class Recur extends Model implements IRecur {
    static table = RecurSchema.table;

    @field(name.TYPE) type!: "daily" | "weekly" | "monthly"
    @field(name.ACTIVE) active!: boolean;
    @date (name.LAST_REFRESHED) lastRefreshed!: Date;
}

export {
    Recur
}