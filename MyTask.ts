import TaskQuery from "src/Models/Task/TaskQuery"
import GlobalQuery, { GlobalLogic } from "src/Models/Global/GlobalQuery"
import Notification from "src/Notification";
import { countOfThings } from "src/Screens/Prototypes/TestScreen";

module.exports = async (taskData) => {
    new GlobalLogic().runRefresh(); 
    new GlobalLogic().runReminders();
}