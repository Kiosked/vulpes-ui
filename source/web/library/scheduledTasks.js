import axios from "axios";
import joinURL from "url-join";
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
