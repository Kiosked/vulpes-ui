import axios from "axios";
import joinURL from "url-join";
import { dispatch } from "../redux/index.js";
import { fetchJob, fetchJobs, fetchJobTree } from "../library/jobFetching.js";
import { setJob, setJobs, setJobTree } from "../actions/jobs.js";

const API_BASE = window.vulpesAPIBase;

export function addJob(properties) {
    return axios
        .post(joinURL(API_BASE, "/add"), {
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

export function collectJob(jobID) {
    return fetchJob(jobID).then(job => {
        dispatch(setJob(job));
    });
}

export function collectAllJobs() {
    return fetchJobs(Infinity).then(jobs => {
        dispatch(setJobs(jobs));
        return jobs;
    });
}

export function collectJobTree(jobID) {
    fetchJobTree(jobID).then(tree => {
        dispatch(
            setJobTree({
                jobID,
                tree
            })
        );
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
