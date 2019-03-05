const KEY = "jobs";

export function getJob(state, jobID) {
    return state[KEY].jobs.find(job => job.id === jobID) || null;
}

export function getJobs(state) {
    return state[KEY].jobs;
}

export function getJobTree(state, jobID) {
    return state[KEY].jobTrees[jobID];
}

export function getJobTypes(state) {
    const types = getJobs(state).map(job => job.type);
    return [...new Set(types)];
}
