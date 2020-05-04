
import { Model } from "@nozbe/watermelondb";
import { field, date, relation, action, readonly} from "@nozbe/watermelondb/decorators";
import { GlobalSchema } from "src/Models/Global/GlobalSchema";

export interface IGlobal {
    current: Date,
    count: number,
    lastNotifiedDate: Date,
    primaryColor: string,
    secondaryColor: string,
    primaryLightColor: string,
    remindMe: boolean;
}

const name = GlobalSchema.name;

export default class Global extends Model implements IGlobal {
    static table = GlobalSchema.table;

    @date(name.CURRENT) current!: Date;
    @field(name.COUNT) count!: number;
    @date(name.LAST_NOTIFIED) lastNotifiedDate!: Date;
    @field(name.PRIMARY_COLOR) primaryColor!: string;
    @field(name.PRIMARY_LIGHT_COLOR) primaryLightColor!: string;
    @field(name.SECONDARY_COLOR) secondaryColor!: string;
    @field(name.REMIND) remindMe!: boolean;
}

export {
    Global as Global
}