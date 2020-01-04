
import { Controller } from "../../../../controllers/Controller";

type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
type WeekEnd = "sunday" | "saturday";
type Day = WeekDay | WeekEnd;

interface State {
    minimum: number
    type: "daily" | "weekly" | "monthly"
    daily_start: Date
    weekly_start: Day
    monthly_start: number
}

class StreakFormController extends Controller<State> {
    constructor(s: State) {
        super(s);
    }

    start() {

    }
}

export {
    StreakFormController,
    State as Data,
    Day,
}