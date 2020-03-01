import TaskQuery from "src/Models/Task/TaskQuery"
import TimeQuery from "src/Models/Global/GlobalQuery"
import Notification from "src/Notification";

module.exports = async (taskData) => {

    Notification.localNotification({
        message: "hi there"
    }) }