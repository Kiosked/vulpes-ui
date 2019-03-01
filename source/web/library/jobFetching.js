import axios from "axios";
import joinURL from "url-join";

const API_BASE = window.vulpesAPIBase;

export function fetchJob(jobId) {
    return axios
        .get(joinURL(API_BASE, `/job/${jobId}`))
        .then(resp => resp.data)
        .catch(function(error) {
            console.log(error);
            throw error;
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
