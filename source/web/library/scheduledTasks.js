import axios from "axios";
import joinURL from "url-join";
import { dispatch } from "../redux/index.js";
import { fetchScheduledTask, fetchScheduledTasks } from "../library/jobFetching.js";
import { setScheduledTask, setScheduledTasks } from "../actions/scheduledTasks.js";

const API_BASE = window.vulpesAPIBase;

export function collectAllScheduledTasks() {
    return fetchScheduledTasks().then(tasks => {
        dispatch(setScheduledTasks(tasks));
        return tasks;
    });
}

export function collectScheduledTask(taskID) {
    return fetchScheduledTask(taskID).then(task => {
        dispatch(setScheduledTask(task));
    });
}

export function createScheduledTask(title, schedule) {
    return axios
        .post(joinURL(API_BASE, "/scheduled-tasks/create"), {
            title,
            schedule
        })
        .then(function(response) {
            return response.data.id;
        })
        .catch(function(error) {
            console.log(error);
            throw error;
        });
}

export function toggleScheduledTask(taskID, enabled) {
    return axios.post(joinURL(API_BASE, `/scheduled-task/${taskID}/status`), {
        enabled
    });
}
