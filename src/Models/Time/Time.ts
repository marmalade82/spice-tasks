
import { Model } from "@nozbe/watermelondb";
import { field, date, relation, action, readonly} from "@nozbe/watermelondb/decorators";
import { TimeSchema } from "src/Models/Time/TimeSchema";

export interface ITime {
    current: Date,
    count: number,
}

const name = TimeSchema.name;

export default class Time extends Model implements ITime {
    static table = TimeSchema.table;

    @date(name.CURRENT) current!: Date;
    @field(name.COUNT) count!: number;
}

export {
    Time
}