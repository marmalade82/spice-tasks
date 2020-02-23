import TaskQuery from "src/Models/Task/TaskQuery"
import TimeQuery from "src/Models/Time/TimeQuery"
import Notification from "src/Notification";

module.exports = async (taskData) => {

    const time = await new TimeQuery().currentTime();
    if(time) {
        new TimeQuery().update(time, {
            count: time.count + 1,
        })
    }
}