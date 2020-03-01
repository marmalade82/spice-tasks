import TaskQuery from "src/Models/Task/TaskQuery"
import GlobalQuery from "src/Models/Global/GlobalQuery"
import Notification from "src/Notification";

module.exports = async (taskData) => {

    Notification.localNotification({
        message: "hi there"
    }) }