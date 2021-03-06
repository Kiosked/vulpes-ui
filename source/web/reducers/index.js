import { combineReducers } from "redux";
import routing from "./routing.js";
import jobs from "./jobs.js";
import scheduledTasks from "./scheduledTasks.js";
import stats from "./stats.js";
import workers from "./workers.js";

export default combineReducers({
    jobs,
    routing,
    scheduledTasks,
    stats,
    workers
});
