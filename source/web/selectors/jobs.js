const KEY = "jobs";

export function getCurrentJobs(state) {
    return state[KEY].jobResults;
}

export function getJob(state, jobID) {
    return state[KEY].jobs.find(job => job.id === jobID) || null;
}

export function getAllJobs(state) {
    return state[KEY].jobs;
}

export function getJobTree(state, jobID) {
    return state[KEY].jobTrees[jobID];
}

export function getJobTypes(state) {
    const types = getJobs(state).map(job => job.type);
    return [...new Set(types)];
}

export function getJobIds(state) {
    const ids = getJobs(state).map(job => job.id);
    return [...new Set(ids)];
}

export function getQueryPage(state) {
    return state[KEY].queryPage;
}

export function getQueryPerPage(state) {
    return state[KEY].queryPerPage;
}

export function getQueryResultsFilter(state) {
    return state[KEY].queryFilterResults;
}

export function getQueryStatusesFilter(state) {
    return state[KEY].queryFilterStatuses;
}

export function getQueryTotalJobs(state) {
    return state[KEY].queryTotal;
}
