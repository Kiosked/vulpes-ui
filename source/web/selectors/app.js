const KEY = "app";

export function getJobs(state) {
    return state[KEY].jobs;
}

export function getJob(state, jobId) {
    const job = state[KEY].jobs[jobId];
    return job;
}
