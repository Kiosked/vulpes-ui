import { combineReducers } from "redux";
import routing from "./routing.js";
import jobs from "./jobs.js";

export default combineReducers({
    jobs,
    routing
});
