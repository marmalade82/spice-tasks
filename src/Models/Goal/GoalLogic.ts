
import { choice } from "src/Models/common/logicUtils";

enum GoalType {
    NORMAL = "normal",
    STREAK = "streak",
}

const GoalChoices = [
    choice("Normal", GoalType.NORMAL),
    choice("Streak", GoalType.STREAK),
]

export {
    GoalType,
    GoalChoices,
}