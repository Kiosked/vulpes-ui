import axios from "axios";
import joinURL from "url-join";
import { dispatch } from "../redux/index.js";
import { setServerTimestamp, setWorkers } from "../actions/workers.js";

const API_BASE = window.vulpesAPIBase;

export function collectWorkers() {
    return fetchWorkers().then(({ workers, timestamp }) => {
        dispatch(setServerTimestamp(timestamp));
        dispatch(setWorkers(workers));
    });
}

export function fetchWorkers() {
    return axios.get(joinURL(API_BASE, "/workers")).then(resp => ({
        workers: resp.data.workers,
        timestamp: resp.data.now
    }));
}
