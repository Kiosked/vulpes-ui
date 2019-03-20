import { dispatch } from "../redux/index.js";
import { fetchScheduledTasks } from "../library/jobFetching.js";
import { setScheduledTasks } from "../actions/scheduledTasks.js";

const API_BASE = window.vulpesAPIBase;

export function collectAllScheduledTasks() {
    fetchScheduledTasks().then(tasks => {
        dispatch(setScheduledTasks(tasks));
        return tasks;
    });
}
