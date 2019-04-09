import axios from "axios";
import joinURL from "url-join";
import objectHash from "object-hash";
import { dispatch, getState } from "../redux/index.js";
import { fetchJob, fetchJobs, fetchJobTree } from "../library/jobFetching.js";
import { setJob, setJobs, setJobTree } from "../actions/jobs.js";
import { getJob, getJobTree } from "../selectors/jobs.js";

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
        const existingJob = getJob(getState(), jobID);
        if (existingJob && !objectsDiffer(existingJob, job)) {
            return;
        }
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
        const existingTree = getJobTree(getState(), jobID);
        if (existingTree && !objectsDiffer(existingTree, tree)) {
            return;
        }
        dispatch(
            setJobTree({
                jobID,
                tree
            })
        );
    });
}

function objectsDiffer(obj1, obj2) {
    const hash1 = objectHash(obj1);
    const hash2 = objectHash(obj2);
    return hash1 !== hash2;
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
