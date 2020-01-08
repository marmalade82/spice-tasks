

import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";

type GoalType = "normal" | "streak"


export default class Goal extends Model {
    static table = 'goals';

    @field('id') id
    @field('title') title
    @field('type') type
    @date('starts_at') startDate 
    @date('due_date') dueDate
}