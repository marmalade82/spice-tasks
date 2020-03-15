
import DB from "src/Models/Database";
import GoalQuery, { Goal, GoalLogic } from 'src/Models/Goal/GoalQuery';
import Recur from "src/Models/Recurrence/Recur";
import RecurQuery, { RecurLogic } from "src/Models/Recurrence/RecurQuery";
import GlobalQuery, { GlobalLogic } from "src/Models/Global/GlobalQuery";


/**
 * Schedules an interval. This interval will update the date in the database when available,
 * which may eventually help to easily evaluate which goals/tasks are overdue or not. This function
 * should also check whether any background service has been stopped, and if so, it should restart them.
 * 
 * @param mins 
 * @param cancel 
 * @param timeUntilNext 
 */
function scheduleRefresh(mins: number, cancel: () => boolean, timeUntilNext?: number) {
    const minutes = (1000 * 60) * mins;
    async function run() {
        // The next refresh should only be scheduled once the current refresh is complete.
        if(!cancel()) {
            const count = 5;
            // process @count of the recurring goals for the day.
            // Keep this logic short so it doesn't take up too much resources.
            await RecurLogic.processSomeRecurrences(count);
            await GoalLogic.processSomeStreaks(count);
        }

        setTimeout(run, minutes);
    }
    run();
}

export const Schedule = {
    refresh: scheduleRefresh,
}