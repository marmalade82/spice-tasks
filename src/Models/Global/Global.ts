
import { Model } from "@nozbe/watermelondb";
import { field, date, relation, action, readonly} from "@nozbe/watermelondb/decorators";
import { GlobalSchema } from "src/Models/Global/GlobalSchema";

export interface IGlobal {
    current: Date,
    count: number,
    lastNotifiedDate: Date,
}

const name = GlobalSchema.name;

export default class Global extends Model implements IGlobal {
    static table = GlobalSchema.table;

    @date(name.CURRENT) current!: Date;
    @field(name.COUNT) count!: number;
    @date(name.LAST_NOTIFIED) lastNotifiedDate!: Date;
}

export {
    Global as Global
}