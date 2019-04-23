import { combineReducers } from "redux";
import routing from "./routing.js";
import jobs from "./jobs.js";
import scheduledTasks from "./scheduledTasks.js";
import log from "./log.js";
import workers from "./workers.js";

export default combineReducers({
    jobs,
    log,
    routing,
    scheduledTasks,
    workers
});
