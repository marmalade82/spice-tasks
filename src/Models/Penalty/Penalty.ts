
import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";
import RewardSchema from "src/Models/Reward/RewardSchema";



interface IPenalty {
    title: string;
    expireDate: Date;
    details: string;
    type: "penalty";
}

const name = RewardSchema.name

export default class Penalty extends Model implements IPenalty {
    static table = RewardSchema.table

    @field(name.TITLE) title
    @date(name.EXPIRES_ON) expireDate
    @field(name.DETAILS) details
    @field(name.TYPE) type
}

export {
    Penalty,
    IPenalty,
}