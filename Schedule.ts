
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
    const ms = (1000 * 60) * mins;
    async function run() {
        // The next refresh should only be scheduled once the current refresh is complete.
        if(!cancel()) {
            await new GlobalLogic().runRecordRefresh();
        }

        setTimeout(run, ms);
    }
    run();
}

function scheduleReminders(mins: number, cancel: () => boolean) {
    const ms = (1000 * 60) * mins;
    let count = 0;
    async function run() {
        // Run the reminder refresh once about every 10 minutes
        if(!cancel() && count === 0) {
            await new GlobalLogic().runReminders();
        }

        count = (count + 1) % 10;

        setTimeout(run, ms);
    }
    run();
}

export const Schedule = {
    refresh: scheduleRefresh,
    reminders: scheduleReminders,
}