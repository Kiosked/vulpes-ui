import { combineReducers } from "redux";
import routing from "./routing.js";
import jobs from "./jobs.js";
import scheduledTasks from "./scheduledTasks.js";

export default combineReducers({
    jobs,
    routing,
    scheduledTasks
});
