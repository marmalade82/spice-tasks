
import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";
import { PenaltySchema } from "src/Models/Penalty/PenaltySchema";



interface IPenalty {
    title: string;
    expireDate: Date;
    details: string;
}

const name = PenaltySchema.name

export default class Penalty extends Model implements IPenalty {
    static table = PenaltySchema.table

    @field(name.TITLE) title
    @date(name.EXPIRES_ON) expireDate
    @field(name.DETAILS) details
}

export {
    Penalty,
    IPenalty,
}