

import { Model } from "@nozbe/watermelondb";
import { field, date } from "@nozbe/watermelondb/decorators";

type GoalType = "normal" | "streak"

interface IGoal {
    id: string;
    title: string;
    type: string;
    startDate: Date;
    dueDate: Date;
}

export default class Goal extends Model implements IGoal {
    static table = 'goals';

    @field('id') id
    @field('title') title
    @field('type') type
    @date('starts_at') startDate 
    @date('due_date') dueDate
}

export {
    Goal,
    IGoal,
}