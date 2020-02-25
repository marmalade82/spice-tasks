
import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";
import RewardSchema from "src/Models/Reward/RewardSchema";



interface IReward {
    title: string;
    expireDate: Date;
    details: string;
    type: "reward";
}

const name = RewardSchema.name

export default class Reward extends Model implements IReward {
    static table = RewardSchema.table

    @field(name.TITLE) title!: string;
    @date(name.EXPIRES_ON) expireDate!: Date;
    @field(name.DETAILS) details!: string;
    @field(name.TYPE) type!: "reward";
}

export {
    Reward,
    IReward,
}