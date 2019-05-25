import axios from "axios";
import joinURL from "url-join";
import ChannelQueue from "@buttercup/channel-queue";
import timeLimit from "time-limit-promise";
import { dispatch } from "../redux/index.js";
import { setStats } from "../actions/stats.js";
import { notifyError } from "../library/notifications.js";

const API_BASE = window.vulpesAPIBase;
const FETCH_TIMELIMIT_STATS = 4000;

const __requests = new ChannelQueue();

export function collectStats() {
    return fetchStats()
        .then(({ stats }) => {
            dispatch(setStats(stats));
        })
        .catch(err => {
            console.error(err);
            notifyError(`Failed fetching stats: ${err.message}`);
        });
}

export function fetchStats() {
    return __requests
        .channel("stats")
        .enqueue(
            () =>
                timeLimit(
                    axios
                        .get(joinURL(API_BASE, "/stats"))
                        .then(resp => ({ stats: resp.data.stats })),
                    FETCH_TIMELIMIT_STATS,
                    { rejectWith: new Error("Timed-out fetching stats") }
                ),
            undefined,
            /* stack: */ "stats"
        );
}
