
import DB from "src/Models/Database";
import GoalQuery, { Goal, GoalLogic } from 'src/Models/Goal/GoalQuery';

async function scheduleStreakGoalRefresh(mins: number, cancel: () => boolean, timeUntilNext?: number)  {
    const minutes = (1000) * mins;
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

export const Schedule = {
    refreshStreakGoals: scheduleStreakGoalRefresh
}