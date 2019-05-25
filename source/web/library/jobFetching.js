import { join } from "path";
import axios from "axios";
import joinURL from "url-join";
import ChannelQueue from "@buttercup/channel-queue";
import timeLimit from "time-limit-promise";
import { dispatch } from "../redux/index.js";
import { setJobsRequestActive } from "../actions/jobs.js";

const API_BASE = window.vulpesAPIBase;
const FETCH_TIMELIMIT_PAGE = 5000;
const FETCH_TIMELIMIT_SINGLE = 3000;

const __requests = new ChannelQueue();

export function fetchJob(jobID) {
    const context = `get:job:${jobID}`;
    return __requests
        .channel(context)
        .enqueue(
            () =>
                timeLimit(
                    axios.get(joinURL(API_BASE, `/job/${jobID}`)).then(resp => resp.data),
                    FETCH_TIMELIMIT_SINGLE,
                    { rejectWith: new Error("Timed-out fetching job") }
                ),
            undefined,
            /* stack: */ context
        );
}

export function fetchJobs({ start, limit, sort, order, search = "" } = {}) {
    const channel = __requests.channel("fetch-jobs");
    channel.clear();
    return channel.enqueue(() =>
        timeLimit(
            axios
                .get(joinURL(API_BASE, "/jobs"), {
                    params: {
                        limit,
                        sort,
                        order,
                        start,
                        search
                    }
                })
                .then(resp => resp.data),
            FETCH_TIMELIMIT_PAGE,
            { rejectWith: new Error("Timed-out fetching jobs") }
        )
    );
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

export function watchJobsQueues() {
    const channel = __requests.channel("fetch-jobs");
    channel.on("started", () => {
        dispatch(setJobsRequestActive(true));
    });
    channel.on("stopped", () => {
        dispatch(setJobsRequestActive(false));
    });
}
