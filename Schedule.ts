
import DB from "src/Models/Database";
import GoalQuery, { Goal, GoalLogic } from 'src/Models/Goal/GoalQuery';

async function scheduleStreakGoalRefresh(cancel: () => boolean)  {
    const minutes = (1000) * 1;
    async function run() {
        console.log("running run");
        if(!cancel()) {
            console.log("running timer");
            const goals: Goal[] = await new GoalQuery().ongoingStreakGoals()
            console.log("there were " + goals.length)

            goals.forEach(async (goal) => {
                console.log("generating streak tasks");
                await new GoalLogic(goal.id).generateStreakTasks(); 
            })
        }
        setTimeout(run, minutes)
    }

    await run();
}

export const Schedule = {
    refreshStreakGoals: scheduleStreakGoalRefresh
}