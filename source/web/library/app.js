import axios from "axios";
import joinURL from "url-join";
import { dispatch } from "../redux/index.js";
import { setJob } from "../actions/app.js";

const API_BASE = window.vulpesAPIBase;

export function fetchJobs(limit, sort, order) {
    return axios
        .get(joinURL(API_BASE, "/jobs"), {
            params: {
                limit: limit,
                sort: sort,
                order: order
            }
        })
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.log(error);
            throw error;
        });
}

export function fetchJob(jobId) {
    return axios
        .get(joinURL(API_BASE, `/job/${jobId}`))
        .then(function(response) {
            const job = response.data;
            dispatch(
                setJob({
                    job,
                    jobId
                })
            );
            return job;
        })
        .catch(function(error) {
            console.log(error);
            throw error;
        });
}

export function fetchJobTree(jobId) {
    return axios
        .get(joinURL(API_BASE, `/tree/${jobId}`))
        .then(function(response) {
            const jobTree = response.data;
            return jobTree;
        })
        .catch(function(error) {
            console.log(error);
            throw error;
        });
}

export function startJob(jobId) {
    return axios
        .get(joinURL(API_BASE, `/start/${jobId}`))
        .then(function(response) {
            const data = response.data;
            return data;
        })
        .catch(function(error) {
            console.log(error);
            throw error;
        });
}

export function stopJob(jobId) {
    return axios
        .get(joinURL(API_BASE, `/stop/${jobId}`))
        .then(function(response) {
            const data = response.data;
            return data;
        })
        .catch(function(error) {
            console.log(error);
            throw error;
        });
}

export function resetJob(jobId) {
    return axios
        .get(joinURL(API_BASE, `/reset/${jobId}`))
        .then(function(response) {
            const data = response.data;
            return data;
        })
        .catch(function(error) {
            console.log(error);
            throw error;
        });
}

export function updateJob(jobId, properties) {
    return axios
        .post(joinURL(API_BASE, `/update/${jobId}`), {
            properties: properties
        })
        .then(function(response) {
            return response.status;
        })
        .catch(function(error) {
            console.log(error);
            throw error;
        });
}

export function addJob(properties) {
    return axios
        .post(joinURL(API_BASE, `/add`), {
            properties: properties
        })
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.log(error);
            throw error;
        });
}
