
import DB from "src/Models/Database";
import GoalQuery, { Goal, GoalLogic } from 'src/Models/Goal/GoalQuery';
import Recur from "src/Models/Recurrence/Recur";
import RecurQuery, { RecurLogic } from "src/Models/Recurrence/RecurQuery";

async function scheduleStreakGoalRefresh(mins: number, cancel: () => boolean, timeUntilNext?: number)  {
    const minutes = (1000 * 60) * mins;
    async function run() {
        if(!cancel()) {
            const goals: Goal[] = await new GoalQuery().ongoingStreakGoals()

            goals.forEach(async (goal) => {
                await new GoalLogic(goal.id).generateStreakTasks(timeUntilNext); 
            })
        }
        setTimeout(run, minutes)
    }

    await run();
}

async function scheduleRecurringGoals(mins: number, cancel: () => boolean, timeUntilNext?: number) {
    const minutes = (1000 * 60) * mins;
    async function run() {
        if(!cancel()) {
            const recurrences: Recur[] = await new RecurQuery().active();

            recurrences.forEach(async (recur) => {
                void new RecurLogic(recur.id).generateNext();
            });
        }
        setTimeout(run, minutes);
    }
    await run();
}

export const Schedule = {
    refreshStreakGoals: scheduleStreakGoalRefresh,
    refreshRecurringGoals: scheduleRecurringGoals,
}