

import Model from "src/Models/base/Model";

import { IMapper } from "src/Models/base/Mapper";

type GoalType = "normal" | "streak"


interface State {
    title: string
    type: "normal" | "streak"
    start_date: Date
    due_date: Date
    // recurring: Recurrence
    // reward: Reward
    // penalty: Penalty
}

export default class Goal extends Model<State> {
    constructor(mapper: IMapper<State>) {
        super(mapper);
    }
}