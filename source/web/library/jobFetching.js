import axios from "axios";
import joinURL from "url-join";
import { join } from "path";

const API_BASE = window.vulpesAPIBase;

export function fetchJob(jobId) {
    return axios
        .get(joinURL(API_BASE, `/job/${jobId}`))
        .then(resp => resp.data)
        .catch(err => {
            console.error(err);
            throw err;
        });
}

export function fetchJobs(limit, sort, order) {
    return axios
        .get(joinURL(API_BASE, "/jobs"), {
            params: {
                limit: limit,
                sort: sort,
                order: order
            }
        })
        .then(resp => resp.data)
        .catch(err => {
            console.error(err);
            throw err;
        });
}

export function fetchJobTree(jobId) {
    return axios
        .get(joinURL(API_BASE, `/tree/${jobId}`))
        .then(response => {
            const jobTree = response.data;
            return jobTree;
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
}

export function fetchScheduledTask(taskID) {
    return axios
        .get(joinURL(API_BASE, `/scheduled-task/${taskID}`))
        .then(response => response.data)
        .catch(err => {
            console.error(err);
            throw err;
        });
}

export function fetchScheduledTasks() {
    return axios
        .get(joinURL(API_BASE, "/scheduled-tasks"))
        .then(response => response.data)
        .catch(err => {
            console.error(err);
            throw err;
        });
}
